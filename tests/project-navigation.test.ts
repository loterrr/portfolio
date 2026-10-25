import assert from "node:assert/strict";
import test from "node:test";
import { projectReelUrl, projectsFeedUrl, profileProjectsUrl, reconcileCategory } from "../lib/project-navigation.ts";

const catalog = [
  { slug: "one", category: "Web", status: "published" },
  { slug: "two", category: "AI", status: "published" },
  { slug: "hidden", category: "Private", status: "draft" },
];

test("a direct project link takes priority over a conflicting category", () => {
  assert.equal(reconcileCategory(catalog, "one", "AI"), "Web");
  assert.equal(reconcileCategory(catalog, "one", "unknown"), "Web");
});

test("ordinary category browsing and all-project reels keep their filter", () => {
  assert.equal(reconcileCategory(catalog, "one", "Web"), "Web");
  assert.equal(reconcileCategory(catalog, "one", ""), "");
  assert.equal(reconcileCategory(catalog, null, "AI"), "AI");
});

test("unknown and draft categories cannot produce an empty reel viewer", () => {
  assert.equal(reconcileCategory(catalog, "missing", "unknown"), "");
  assert.equal(reconcileCategory(catalog, "hidden", "Private"), "");
});

test("project cards use dedicated reel paths and preserve category and technology", () => {
  const params = new URLSearchParams("tab=Projects&project=old&category=Web&technology=React");
  assert.equal(projectReelUrl("peer-drop", params), "/projects/peer-drop?category=Web&technology=React");
  assert.equal(projectReelUrl("a/b", new URLSearchParams()), "/projects/a%2Fb");
});

test("project feed links open the profile's Projects tab", () => {
  assert.equal(projectsFeedUrl(new URLSearchParams("tab=Tech+Stack&technology=React")), "/?tab=Projects&technology=React");
});

test("returning to the profile always lands on the Projects tab", () => {
  assert.equal(profileProjectsUrl(new URLSearchParams("tab=Projects&project=peer-drop&category=Web")), "/?tab=Projects&category=Web");
  assert.equal(profileProjectsUrl(new URLSearchParams()), "/?tab=Projects");
});
