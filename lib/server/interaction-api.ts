import { ApiError } from "./api-error.ts";
import type { CommentPage, ProjectInteraction } from "../interaction-types.ts";

export type InteractionDatabase = {
  close?: () => void;
  hasVisitor: (id: string) => boolean | Promise<boolean>;
  createVisitor: () => string | Promise<string>;
  listInteractions: (visitorId: string) => ProjectInteraction[] | Promise<ProjectInteraction[]>;
  setLike: (projectId: string, visitorId: string, liked: boolean) => ProjectInteraction[] | Promise<ProjectInteraction[]>;
  listComments: (projectId: string, cursor?: string | null) => CommentPage | Promise<CommentPage>;
  addComment: (projectId: string, visitorId: string, name: string, body: string) => void | Promise<void>;
  listModeration: (status: "pending" | "approved", cursor?: string | null) => CommentPage | Promise<CommentPage>;
  moderateComment: (id: string, status: "approved" | "deleted") => void | Promise<void>;
};

const cookieName = "scrollfolio_visitor";
type Handler = (request: Request) => Promise<Response> | Response;

export function createInteractionApi(database: () => InteractionDatabase | Promise<InteractionDatabase>, environment: string | undefined = process.env.NODE_ENV) {
  function endpoint(handler: Handler): Handler {
    return async (request) => {
      try { return await handler(request); }
      catch (error) {
        return json({ error: error instanceof ApiError ? error.message : "Unable to save or load interactions. Please try again." }, error instanceof ApiError ? error.status : 503);
      }
    };
  }

  function json(value: unknown, status = 200, headers?: HeadersInit) {
    return Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
  }

  function visitor(request: Request) {
    const id = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1) ?? "";
    return /^[\da-f-]{36}$/.test(id) ? id : "";
  }

  function sameOrigin(request: Request) {
    if (request.headers.get("origin") !== publicUrl(request).origin || request.headers.get("sec-fetch-site") === "cross-site") {
      throw new ApiError(403, "This request must come from the portfolio.");
    }
  }

  function publicUrl(request: Request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    if (!host) return url;
    try {
      // Next.js can use localhost internally while the browser accesses the loopback address.
      const result = new URL(`${url.protocol}//${host}`);
      if (result.host !== host.toLowerCase()) throw new Error();
      return result;
    } catch { throw new ApiError(403, "Invalid request host."); }
  }

  async function body(request: Request): Promise<Record<string, unknown>> {
    sameOrigin(request);
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new ApiError(415, "Send JSON data.");
    if (Number(request.headers.get("content-length")) > 8192) throw new ApiError(413, "Request is too large.");
    const reader = request.body?.getReader();
    if (!reader) throw new ApiError(400, "Missing request data.");
    const decoder = new TextDecoder();
    let size = 0;
    let text = "";
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 8192) {
          await reader.cancel();
          throw new ApiError(413, "Request is too large.");
        }
        text += decoder.decode(chunk.value, { stream: true });
      }
      text += decoder.decode();
    } finally { reader.releaseLock(); }
    try {
      const value: unknown = JSON.parse(text);
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
      return value as Record<string, unknown>;
    } catch { throw new ApiError(400, "Invalid JSON data."); }
  }

  function text(value: unknown, label: string, maximum: number) {
    if (typeof value !== "string" || !value.trim() || value.length > maximum) throw new ApiError(400, `Invalid ${label}.`);
    return value.trim();
  }

  function requireLocalOwner(request: Request) {
    const url = publicUrl(request);
    if (environment !== "development" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
      || request.headers.get("sec-fetch-site") === "cross-site"
      || (request.headers.has("origin") && request.headers.get("origin") !== url.origin)) {
      throw new ApiError(403, "Moderation is available only on the local development server.");
    }
  }

  return {
    getInteractions: endpoint(async (request) => {
      const db = await database();
      let id = visitor(request);
      let headers;
      if (!id || !(await db.hasVisitor(id))) {
        id = await db.createVisitor();
        const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
        headers = { "Set-Cookie": `${cookieName}=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=31536000${secure}` };
      }
      return json({ interactions: await db.listInteractions(id) }, 200, headers);
    }),
    like: endpoint(async (request) => {
      const input = await body(request);
      const projectId = text(input.projectId, "project ID", 100);
      if (typeof input.liked !== "boolean") throw new ApiError(400, "Invalid like state.");
      const db = await database();
      return json({ interactions: await db.setLike(projectId, visitor(request), input.liked) });
    }),
    getComments: endpoint(async (request) => {
      const params = new URL(request.url).searchParams;
      const db = await database();
      return json(await db.listComments(text(params.get("projectId"), "project ID", 100), params.get("before")));
    }),
    comment: endpoint(async (request) => {
      const input = await body(request);
      if (input.website !== undefined && input.website !== "") throw new ApiError(400, "Could not submit this comment.");
      const db = await database();
      await db.addComment(text(input.projectId, "project ID", 100), visitor(request), text(input.name, "display name", 40), text(input.body, "comment", 1000));
      return json({ message: "Submitted for owner review." }, 201);
    }),
    getModeration: endpoint(async (request) => {
      requireLocalOwner(request);
      const params = new URL(request.url).searchParams;
      const status = params.get("status") ?? "pending";
      if (status !== "pending" && status !== "approved") throw new ApiError(400, "Invalid comment status.");
      const db = await database();
      return json(await db.listModeration(status, params.get("before")));
    }),
    moderate: endpoint(async (request) => {
      requireLocalOwner(request);
      const input = await body(request);
      if (input.status !== "approved" && input.status !== "deleted") throw new ApiError(400, "Invalid moderation action.");
      const db = await database();
      await db.moderateComment(text(input.id, "comment ID", 15), input.status);
      return json({ saved: true });
    }),
  };
}
