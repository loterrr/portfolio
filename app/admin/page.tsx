"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { interactionRequest } from "@/lib/interactions";
import type { CommentPage, ProjectComment } from "@/lib/interaction-types";
import { projects } from "@/lib/portfolio";

export default function LocalCommentReview() {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [status, setStatus] = useState<"pending" | "approved">("pending");
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async (before?: string | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status });
      if (before) params.set("before", before);
      const result = await interactionRequest<CommentPage>(`moderation?${params}`);
      setComments((current) => before ? [...current, ...result.comments] : result.comments);
      setCursor(result.nextCursor);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load comments.");
    } finally { setLoading(false); }
  }, [status]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") void refresh();
  }, [refresh]);

  async function moderate(id: string, nextStatus: "approved" | "deleted") {
    setSaving(id);
    try {
      await interactionRequest("moderation", "PATCH", { id, status: nextStatus });
      setComments((current) => current.filter((comment) => comment.id !== id));
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save this decision. Please try again.");
    } finally { setSaving(null); }
  }

  if (process.env.NODE_ENV !== "development") {
    return <main className="admin-page"><a className="back-link" href="/"><ArrowLeft size={18} /> Back to portfolio</a><h1>Review unavailable</h1><p className="admin-warning">Owner review is available on the local development server.</p></main>;
  }

  return <main className="admin-page">
    <header><a className="back-link" href="/"><ArrowLeft size={18} /> Back to portfolio</a><span className="reel-count">Local SQLite</span></header>
    <h1>Comment review</h1>
    <p className="admin-warning">Submissions are stored in the local database. Approved comments appear for every visitor using this server.</p>
    <nav className="filters" aria-label="Comment status">{(["pending", "approved"] as const).map((item) => <button key={item} className={status === item ? "selected" : ""} aria-pressed={status === item} disabled={loading} onClick={() => { if (item === status) return; setComments([]); setCursor(null); setStatus(item); }}>{item === "pending" ? "Waiting for review" : "Approved"}</button>)}</nav>
    {error && <p className="form-message" role="alert">{error} <button className="text-link" disabled={loading} onClick={() => void refresh()}>Retry</button></p>}
    <div className="admin-list">{comments.map((comment) => <article className="admin-comment" key={comment.id}>
      <div><strong>{comment.name}</strong><small>{projects.find((project) => project.id === comment.projectId)?.title ?? "Archived project"} · {new Date(comment.createdAt).toLocaleString()}</small><p>{comment.body}</p></div>
      <div className="admin-actions">{comment.status === "pending" && <button disabled={saving !== null} onClick={() => void moderate(comment.id, "approved")}><Check size={14} /> Approve</button>}<button disabled={saving !== null} onClick={() => void moderate(comment.id, "deleted")}><Trash2 size={14} /> Delete</button></div>
    </article>)}</div>
    {loading && <p className="muted-empty" role="status">Loading comments…</p>}
    {!loading && !error && !comments.length && <p className="muted-empty">No {status} comments.</p>}
    {!loading && cursor && <button className="text-link" onClick={() => void refresh(cursor)}>Load older comments</button>}
  </main>;
}
