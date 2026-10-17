"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CommentPage, ProjectInteraction } from "./interaction-types";

export async function interactionRequest<T>(path: string, method = "GET", body?: object): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    method, credentials: "same-origin", cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not save or load interactions. Please try again.");
  return result as T;
}

export function loadComments(projectId: string, before?: string | null) {
  const params = new URLSearchParams({ projectId });
  if (before) params.set("before", before);
  return interactionRequest<CommentPage>(`comments?${params}`);
}

export function useInteractions() {
  const [interactions, setInteractions] = useState<ProjectInteraction[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const version = useRef(0);
  const writing = useRef(false);

  const refresh = useCallback(async () => {
    if (writing.current) return;
    const requestVersion = ++version.current;
    try {
      const result = await interactionRequest<{ interactions: ProjectInteraction[] }>("interactions");
      if (requestVersion !== version.current) return;
      setInteractions(result.interactions);
      setReady(true);
      setError("");
    } catch {
      if (requestVersion === version.current) setError("Reactions are unavailable. Try again.");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("focus", onFocus); version.current++; };
  }, [refresh]);

  async function like(projectId: string) {
    if (!ready || writing.current) return;
    writing.current = true;
    version.current++;
    setSaving(projectId);
    try {
      const liked = !interactions.find((item) => item.projectId === projectId)?.liked;
      const result = await interactionRequest<{ interactions: ProjectInteraction[] }>("interactions", "PUT", { projectId, liked });
      setInteractions(result.interactions);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save this reaction. Please try again.");
    } finally { writing.current = false; setSaving(null); }
  }

  return { interactions, ready, error, saving, like, refresh };
}
