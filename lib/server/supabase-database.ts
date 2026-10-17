import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import type { CommentPage, ProjectComment, ProjectInteraction } from "../interaction-types.ts";
import { ApiError } from "./api-error.ts";

export function openSupabaseDatabase(url: string, key: string) {
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  async function requireProject(id: string) {
    const { data } = await supabase.from("projects").select("id").eq("id", id).eq("status", "published").maybeSingle();
    if (!data) throw new ApiError(404, "Project unavailable.");
  }

  async function hasVisitor(id: string) {
    const { data } = await supabase.from("visitors").select("id").eq("id", id).maybeSingle();
    return Boolean(data);
  }

  async function requireVisitor(id: string) {
    if (!(await hasVisitor(id))) throw new ApiError(401, "Reload the portfolio before trying again.");
  }

  async function limit(visitorId: string, action: "like" | "comment", maximum: number) {
    const now = Date.now();
    const { data: row } = await supabase.from("rate_limits").select("window_start, requests").eq("visitor_id", visitorId).eq("action", action).maybeSingle();
    const current = row && now - Number(row.window_start) < 60_000;
    if (current && Number(row.requests) >= maximum) throw new ApiError(429, "Please wait a minute before trying again.");

    await supabase.from("rate_limits").upsert({
      visitor_id: visitorId,
      action,
      window_start: current ? Number(row.window_start) : now,
      requests: current ? Number(row.requests) + 1 : 1,
    }, { onConflict: "visitor_id,action" });
  }

  async function listInteractions(visitorId: string): Promise<ProjectInteraction[]> {
    const { data: projects, error: pErr } = await supabase.from("projects").select("id").eq("status", "published").order("id");
    if (pErr) throw pErr;

    const { data: likes, error: lErr } = await supabase.from("likes").select("project_id, visitor_id");
    if (lErr) throw lErr;

    const { data: comments, error: cErr } = await supabase.from("comments").select("project_id").eq("status", "approved");
    if (cErr) throw cErr;

    const likeCounts = new Map<string, number>();
    const userLiked = new Set<string>();
    for (const l of likes || []) {
      likeCounts.set(l.project_id, (likeCounts.get(l.project_id) || 0) + 1);
      if (visitorId && l.visitor_id === visitorId) userLiked.add(l.project_id);
    }

    const commentCounts = new Map<string, number>();
    for (const c of comments || []) {
      commentCounts.set(c.project_id, (commentCounts.get(c.project_id) || 0) + 1);
    }

    return (projects || []).map((p) => ({
      projectId: p.id,
      like_count: likeCounts.get(p.id) || 0,
      comment_count: commentCounts.get(p.id) || 0,
      liked: userLiked.has(p.id),
    }));
  }

  async function commentPage(queryFilter: (query: any) => any, cursor?: string | null): Promise<CommentPage> {
    if (cursor && !/^[1-9]\d{0,14}$/.test(cursor)) throw new ApiError(400, "Invalid comment cursor.");

    let query = supabase.from("comments")
      .select("id, project_id, name, body, created_at, status")
      .order("id", { ascending: false })
      .limit(51);

    query = queryFilter(query);

    if (cursor) {
      query = query.lt("id", Number(cursor));
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []).map((row) => ({
      id: String(row.id),
      projectId: row.project_id,
      name: row.name,
      body: row.body,
      createdAt: row.created_at,
      status: row.status,
    }));

    const comments = rows.slice(0, 50) as unknown as ProjectComment[];
    return { comments, nextCursor: rows.length > 50 ? comments[comments.length - 1].id : null };
  }

  return {
    close: () => {},
    hasVisitor,
    async createVisitor() {
      const id = randomUUID();
      await supabase.from("visitors").insert({ id, created_at: Date.now() });
      return id;
    },
    listInteractions,
    async setLike(projectId: string, visitorId: string, liked: boolean) {
      await requireProject(projectId);
      await requireVisitor(visitorId);
      await limit(visitorId, "like", 60);

      if (liked) {
        await supabase.from("likes").upsert({ project_id: projectId, visitor_id: visitorId, created_at: Date.now() }, { onConflict: "project_id,visitor_id" });
      } else {
        await supabase.from("likes").delete().eq("project_id", projectId).eq("visitor_id", visitorId);
      }
      return listInteractions(visitorId);
    },
    async addComment(projectId: string, visitorId: string, name: string, body: string) {
      const cleanName = name.trim();
      const cleanBody = body.trim();
      if (cleanName.length < 2 || cleanName.length > 40 || cleanBody.length < 8 || cleanBody.length > 1000) {
        throw new ApiError(400, "Use a display name of 2–40 characters and a comment of 8–1,000 characters.");
      }
      await requireProject(projectId);
      await requireVisitor(visitorId);
      await limit(visitorId, "comment", 1);

      const { error } = await supabase.from("comments").insert({
        project_id: projectId,
        visitor_id: visitorId,
        name: cleanName,
        body: cleanBody,
        created_at: new Date().toISOString(),
        status: "pending",
      });
      if (error) throw error;
    },
    async listComments(projectId: string, cursor?: string | null) {
      await requireProject(projectId);
      return commentPage((q) => q.eq("project_id", projectId).eq("status", "approved"), cursor);
    },
    async listModeration(status: "pending" | "approved", cursor?: string | null) {
      return commentPage((q) => q.eq("status", status), cursor);
    },
    async moderateComment(id: string, status: "approved" | "deleted") {
      if (!/^[1-9]\d{0,14}$/.test(id)) throw new ApiError(400, "Invalid comment ID.");
      if (status === "deleted") {
        const { error } = await supabase.from("comments").delete().eq("id", Number(id));
        if (error) throw error;
      } else {
        const { error } = await supabase.from("comments").update({ status: "approved" }).eq("id", Number(id));
        if (error) throw error;
      }
    },
  };
}
