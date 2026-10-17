import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { openDatabase } from "../lib/server/database.ts";

const catalog = [
  { id: "published", slug: "published", title: "Fixture", status: "published" as const },
  { id: "draft", slug: "draft", title: "Draft fixture", status: "draft" as const },
];

test("likes persist across connections and repeated likes count only once", () => {
  const directory = mkdtempSync(join(tmpdir(), "scrollfolio-test-"));
  const path = join(directory, "test.sqlite");
  try {
    const first = openDatabase(path, catalog);
    const visitor = first.createVisitor();
    first.setLike("published", visitor, true);
    first.setLike("published", visitor, true);
    first.close();
    const second = openDatabase(path, catalog);
    try {
      assert.equal(second.listInteractions(visitor)[0].like_count, 1);
      const other = second.createVisitor();
      assert.equal(second.listInteractions(other)[0].liked, false);
      second.setLike("published", other, true);
      assert.equal(second.listInteractions(visitor)[0].like_count, 2);
      second.setLike("published", visitor, false);
      second.setLike("published", visitor, false);
      assert.equal(second.listInteractions(visitor)[0].like_count, 1);
    } finally { second.close(); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("pending comments stay private until approved; deletion updates real counts", () => {
  const db = openDatabase(":memory:", catalog);
  try {
    db.addComment("published", db.createVisitor(), "Visitor", "Useful project example.");
    assert.equal(db.listComments("published").comments.length, 0);
    assert.equal(db.listInteractions("")[0].comment_count, 0);
    const pending = db.listModeration("pending").comments[0];
    db.moderateComment(pending.id, "approved");
    const approved = db.listComments("published").comments[0];
    assert.equal(approved.body, "Useful project example.");
    assert.equal("visitorId" in approved, false);
    assert.equal(db.listInteractions("")[0].comment_count, 1);
    db.moderateComment(pending.id, "deleted");
    assert.equal(db.listComments("published").comments.length, 0);
    assert.equal(db.listInteractions("")[0].comment_count, 0);
  } finally { db.close(); }
});

test("unknown projects, drafts, unknown visitors, and invalid comments are rejected", () => {
  const db = openDatabase(":memory:", catalog);
  try {
    const visitor = db.createVisitor();
    for (const id of ["missing", "draft"]) {
      assert.throws(() => db.setLike(id, visitor, true), /Project unavailable/);
      assert.throws(() => db.addComment(id, visitor, "Visitor", "A valid comment body."), /Project unavailable/);
    }
    assert.throws(() => db.setLike("published", "invented", true), /Reload/);
    assert.throws(() => db.addComment("published", visitor, " ", "short"), /name|comment/i);
    assert.equal(db.listInteractions(visitor)[0].like_count, 0);
  } finally { db.close(); }
});

test("comment cooldown survives changing names, deletion, and another connection", () => {
  const directory = mkdtempSync(join(tmpdir(), "scrollfolio-test-"));
  try {
    const path = join(directory, "test.sqlite");
    const first = openDatabase(path, catalog);
    const visitor = first.createVisitor();
    first.addComment("published", visitor, "Visitor", "First useful comment.");
    first.moderateComment(first.listModeration("pending").comments[0].id, "deleted");
    first.close();
    const second = openDatabase(path, catalog);
    try {
      assert.throws(() => second.addComment("published", visitor, "Different alias", "Another useful comment."), /wait/i);
    } finally { second.close(); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("removed projects retain data without accepting interactions", () => {
  const directory = mkdtempSync(join(tmpdir(), "scrollfolio-test-"));
  try {
    const path = join(directory, "test.sqlite");
    const first = openDatabase(path, catalog);
    const visitor = first.createVisitor();
    first.setLike("published", visitor, true);
    first.close();
    const second = openDatabase(path, []);
    assert.equal(second.listInteractions(visitor).length, 0);
    assert.throws(() => second.setLike("published", visitor, true), /Project unavailable/);
    second.close();
    const restored = openDatabase(path, catalog);
    assert.equal(restored.listInteractions(visitor)[0].like_count, 1);
    restored.close();
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("comment pagination does not hide older submissions", () => {
  const db = openDatabase(":memory:", catalog);
  try {
    for (let index = 0; index < 51; index++) {
      db.addComment("published", db.createVisitor(), "Visitor", `Fixture comment number ${index}.`);
    }
    const first = db.listModeration("pending");
    assert.equal(first.comments.length, 50);
    assert.ok(first.nextCursor);
    const second = db.listModeration("pending", first.nextCursor!);
    assert.equal(second.comments.length, 1);
    assert.equal(second.nextCursor, null);
    assert.notEqual(first.comments[49].id, second.comments[0].id);
  } finally { db.close(); }
});
