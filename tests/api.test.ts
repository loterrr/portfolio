import assert from "node:assert/strict";
import test from "node:test";
import { createInteractionApi } from "../lib/server/interaction-api.ts";
import { openDatabase } from "../lib/server/database.ts";

function setup(environment = "development") {
  const db = openDatabase(":memory:", [{ id: "fixture", slug: "fixture", title: "Fixture", status: "published" }]);
  return { db, api: createInteractionApi(() => db, environment) };
}

function request(path: string, method = "GET", body?: object, cookie = "", origin = "http://127.0.0.1:3000") {
  return new Request(`http://127.0.0.1:3000/api/${path}`, {
    method,
    headers: { origin, cookie, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

test("API uses issued cookies and idempotent likes with shared real counts", async () => {
  const { db, api } = setup();
  try {
    const initial = await api.getInteractions(request("interactions"));
    const cookie = initial.headers.get("set-cookie")!.split(";")[0];
    assert.match(initial.headers.get("set-cookie")!, /HttpOnly/);
    assert.match(initial.headers.get("set-cookie")!, /SameSite=Strict/);
    for (let index = 0; index < 2; index++) {
      const response = await api.like(request("interactions", "PUT", { projectId: "fixture", liked: true }, cookie));
      assert.equal(response.status, 200);
      assert.equal((await response.json()).interactions[0].like_count, 1);
    }
    const stranger = await api.getInteractions(request("interactions"));
    const other = (await stranger.json()).interactions[0];
    assert.equal(other.like_count, 1);
    assert.equal(other.liked, false);
  } finally { db.close(); }
});

test("cross-origin, unauthenticated, malformed, and oversized writes are rejected", async () => {
  const { db, api } = setup();
  try {
    assert.equal((await api.like(request("interactions", "PUT", { projectId: "fixture", liked: true }, "", "https://example.org"))).status, 403);
    assert.equal((await api.like(request("interactions", "PUT", { projectId: "fixture", liked: true }))).status, 401);
    assert.equal((await api.like(new Request("http://127.0.0.1:3000/api/interactions", { method: "PUT", headers: { origin: "http://127.0.0.1:3000", "content-type": "application/json" }, body: "{" }))).status, 400);
    assert.equal((await api.comment(request("comments", "POST", { body: "x".repeat(9000) }))).status, 413);
    assert.equal(db.listInteractions("")[0].like_count, 0);
  } finally { db.close(); }
});

test("API keeps pending comments private and rejects the honeypot", async () => {
  const { db, api } = setup();
  try {
    const initial = await api.getInteractions(request("interactions"));
    const cookie = initial.headers.get("set-cookie")!.split(";")[0];
    const comment = { projectId: "fixture", name: "Visitor", body: "Useful fixture project.", website: "" };
    assert.equal((await api.comment(request("comments", "POST", { ...comment, website: "spam" }, cookie))).status, 400);
    assert.equal((await api.comment(request("comments", "POST", comment, cookie))).status, 201);
    const publicResponse = await api.getComments(request("comments?projectId=fixture"));
    assert.deepEqual((await publicResponse.json()).comments, []);
    const pending = await api.getModeration(request("moderation"));
    const id = (await pending.json()).comments[0].id;
    assert.equal((await api.moderate(request("moderation", "PATCH", { id, status: "approved" }))).status, 200);
    const approved = await api.getComments(request("comments?projectId=fixture"));
    assert.equal((await approved.json()).comments.length, 1);
  } finally { db.close(); }
});

test("moderation refuses production, remote hosts, and cross-site reads", async () => {
  for (const environment of ["production", "development"]) {
    const { db, api } = setup(environment);
    try {
      const url = environment === "production" ? "http://127.0.0.1:3000/api/moderation" : "http://example.org/api/moderation";
      assert.equal((await api.getModeration(new Request(url))).status, 403);
    } finally { db.close(); }
  }
  const { db, api } = setup();
  try {
    assert.equal((await api.getModeration(new Request("http://127.0.0.1:3000/api/moderation", { headers: { "sec-fetch-site": "cross-site" } }))).status, 403);
  } finally { db.close(); }
});

test("database failures return a safe retry message without internal details", async () => {
  const api = createInteractionApi(() => { throw new Error("Internal database detail"); });
  const response = await api.getInteractions(request("interactions"));
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /Internal database detail/);
});

test("same-origin writes accept the public Host when Next uses an internal localhost URL", async () => {
  const { db, api } = setup();
  try {
    const initial = await api.getInteractions(request("interactions"));
    const cookie = initial.headers.get("set-cookie")!.split(";")[0];
    const response = await api.like(new Request("http://localhost:3000/api/interactions", {
      method: "PUT",
      headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000", cookie, "content-type": "application/json" },
      body: JSON.stringify({ projectId: "fixture", liked: true }),
    }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).interactions[0].like_count, 1);
  } finally { db.close(); }
});

test("an internal localhost URL cannot disguise a remote moderation Host", async () => {
  const { db, api } = setup();
  try {
    const response = await api.getModeration(new Request("http://localhost:3000/api/moderation", {
      headers: { host: "example.org" },
    }));
    assert.equal(response.status, 403);
  } finally { db.close(); }
});
