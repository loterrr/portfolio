import assert from "node:assert/strict";
import test from "node:test";
import { openSupabaseDatabase } from "../lib/server/supabase-database.ts";

test("Supabase registers the catalog before serving interactions and propagates failed writes", async (context) => {
  const writes: { table: string; body: unknown }[] = [];
  let failure = "";
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
    const request = new Request(input, init);
    const table = new URL(request.url).pathname.split("/").at(-1)!;
    if (request.method === "POST" || request.method === "DELETE") {
      const body = await request.text();
      writes.push({ table, body: body ? JSON.parse(body) : null });
    }
    if (table === failure) {
      return Response.json({ message: "Fixture write failure", code: "23514" }, { status: 400 });
    }
    const result = table === "projects" ? { id: "new-project" }
      : table === "visitors" ? { id: "fixture-visitor" } : null;
    return Response.json(result);
  });
  const catalog = [{ id: "new-project", slug: "new-project", title: "New project", status: "published" as const }];
  const db = await openSupabaseDatabase("https://fixture.supabase.co", "fixture-key", catalog);
  assert.deepEqual(writes[0], { table: "projects", body: catalog.map((project) => ({ ...project, data: JSON.stringify(project) })) });
  failure = "visitors";
  await assert.rejects(() => db.createVisitor(), { code: "23514" });
  failure = "rate_limits";
  await assert.rejects(() => db.setLike("new-project", "fixture-visitor", true), { code: "23514" });
  assert.equal(writes.some((write) => write.table === "likes"), false);
  failure = "likes";
  await assert.rejects(() => db.setLike("new-project", "fixture-visitor", true), { code: "23514" });
  await assert.rejects(() => db.setLike("new-project", "fixture-visitor", false), { code: "23514" });
  failure = "projects";
  await assert.rejects(() => openSupabaseDatabase("https://fixture.supabase.co", "fixture-key", catalog), { code: "23514" });
});
