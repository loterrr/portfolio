import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { CommentPage, ProjectComment, ProjectInteraction } from "../interaction-types.ts";
import { ApiError } from "./api-error.ts";

type CatalogProject = { id: string; slug: string; title: string; status: "published" | "draft" };

export function openDatabase(path: string, catalog: CatalogProject[]) {
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY CHECK(length(id) BETWEEN 1 AND 100),
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published')),
      data TEXT NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS visitors (
      id TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS likes (
      project_id TEXT NOT NULL REFERENCES projects(id),
      visitor_id TEXT NOT NULL REFERENCES visitors(id),
      created_at INTEGER NOT NULL,
      PRIMARY KEY (project_id, visitor_id)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL REFERENCES projects(id),
      visitor_id TEXT NOT NULL REFERENCES visitors(id),
      name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 40),
      body TEXT NOT NULL CHECK(length(body) BETWEEN 8 AND 1000),
      created_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved'))
    ) STRICT;
    CREATE INDEX IF NOT EXISTS comments_project_status ON comments(project_id, status, id DESC);
    CREATE INDEX IF NOT EXISTS comments_status ON comments(status, id DESC);
    CREATE TABLE IF NOT EXISTS rate_limits (
      visitor_id TEXT NOT NULL REFERENCES visitors(id),
      action TEXT NOT NULL CHECK(action IN ('like', 'comment')),
      window_start INTEGER NOT NULL,
      requests INTEGER NOT NULL,
      PRIMARY KEY(visitor_id, action)
    ) STRICT;
    PRAGMA user_version = 1;
  `);

  function transaction<T>(action: () => T): T {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = action();
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  try {
    transaction(() => {
      db.exec("UPDATE projects SET status = 'draft'");
      const upsert = db.prepare(`INSERT INTO projects(id, slug, title, status, data) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, title = excluded.title, status = excluded.status, data = excluded.data`);
      for (const project of catalog) upsert.run(project.id, project.slug, project.title, project.status, JSON.stringify(project));
    });
  } catch (error) {
    db.close();
    throw error;
  }

  function requireProject(id: string) {
    if (!db.prepare("SELECT id FROM projects WHERE id = ? AND status = 'published'").get(id)) {
      throw new ApiError(404, "Project unavailable.");
    }
  }

  function hasVisitor(id: string) {
    return Boolean(db.prepare("SELECT id FROM visitors WHERE id = ?").get(id));
  }

  function requireVisitor(id: string) {
    if (!hasVisitor(id)) throw new ApiError(401, "Reload the portfolio before trying again.");
  }

  function limit(visitorId: string, action: "like" | "comment", maximum: number) {
    const now = Date.now();
    const row = db.prepare("SELECT window_start, requests FROM rate_limits WHERE visitor_id = ? AND action = ?").get(visitorId, action);
    const current = row && now - Number(row.window_start) < 60_000;
    if (current && Number(row.requests) >= maximum) throw new ApiError(429, "Please wait a minute before trying again.");
    db.prepare(`INSERT INTO rate_limits VALUES (?, ?, ?, ?)
      ON CONFLICT(visitor_id, action) DO UPDATE SET window_start = excluded.window_start, requests = excluded.requests`)
      .run(visitorId, action, current ? Number(row.window_start) : now, current ? Number(row.requests) + 1 : 1);
  }

  function listInteractions(visitorId: string): ProjectInteraction[] {
    const rows = db.prepare(`SELECT p.id AS projectId,
      (SELECT count(*) FROM likes l WHERE l.project_id = p.id) AS like_count,
      (SELECT count(*) FROM comments c WHERE c.project_id = p.id AND c.status = 'approved') AS comment_count,
      EXISTS(SELECT 1 FROM likes l WHERE l.project_id = p.id AND l.visitor_id = ?) AS liked
      FROM projects p WHERE p.status = 'published' ORDER BY p.id`).all(visitorId);
    return rows.map((row) => ({ projectId: String(row.projectId), like_count: Number(row.like_count), comment_count: Number(row.comment_count), liked: Boolean(row.liked) }));
  }

  function commentPage(where: string, parameters: string[], cursor?: string | null): CommentPage {
    if (cursor && !/^[1-9]\d{0,14}$/.test(cursor)) throw new ApiError(400, "Invalid comment cursor.");
    const rows = db.prepare(`SELECT CAST(id AS TEXT) AS id, project_id AS projectId, name, body, created_at AS createdAt, status
      FROM comments WHERE ${where} AND comments.id < ? ORDER BY comments.id DESC LIMIT 51`).all(...parameters, cursor ? Number(cursor) : Number.MAX_SAFE_INTEGER);
    const comments = rows.slice(0, 50) as unknown as ProjectComment[];
    return { comments, nextCursor: rows.length > 50 ? comments[comments.length - 1].id : null };
  }

  return {
    close: () => db.close(),
    hasVisitor,
    createVisitor() {
      const id = randomUUID();
      db.prepare("INSERT INTO visitors VALUES (?, ?)").run(id, Date.now());
      return id;
    },
    listInteractions,
    setLike(projectId: string, visitorId: string, liked: boolean) {
      return transaction(() => {
        requireProject(projectId);
        requireVisitor(visitorId);
        limit(visitorId, "like", 60);
        if (liked) db.prepare("INSERT INTO likes VALUES (?, ?, ?) ON CONFLICT DO NOTHING").run(projectId, visitorId, Date.now());
        else db.prepare("DELETE FROM likes WHERE project_id = ? AND visitor_id = ?").run(projectId, visitorId);
        return listInteractions(visitorId);
      });
    },
    addComment(projectId: string, visitorId: string, name: string, body: string) {
      const cleanName = name.trim();
      const cleanBody = body.trim();
      if (cleanName.length < 2 || cleanName.length > 40 || cleanBody.length < 8 || cleanBody.length > 1000) {
        throw new ApiError(400, "Use a display name of 2–40 characters and a comment of 8–1,000 characters.");
      }
      transaction(() => {
        requireProject(projectId);
        requireVisitor(visitorId);
        limit(visitorId, "comment", 1);
        db.prepare("INSERT INTO comments(project_id, visitor_id, name, body, created_at) VALUES (?, ?, ?, ?, ?)")
          .run(projectId, visitorId, cleanName, cleanBody, new Date().toISOString());
      });
    },
    listComments(projectId: string, cursor?: string | null) {
      requireProject(projectId);
      return commentPage("project_id = ? AND status = 'approved'", [projectId], cursor);
    },
    listModeration(status: "pending" | "approved", cursor?: string | null) {
      return commentPage("status = ?", [status], cursor);
    },
    moderateComment(id: string, status: "approved" | "deleted") {
      if (!/^[1-9]\d{0,14}$/.test(id)) throw new ApiError(400, "Invalid comment ID.");
      const result = status === "deleted"
        ? db.prepare("DELETE FROM comments WHERE id = ?").run(Number(id))
        : db.prepare("UPDATE comments SET status = 'approved' WHERE id = ?").run(Number(id));
      if (!Number(result.changes)) throw new ApiError(404, "Comment unavailable.");
    },
  };
}
