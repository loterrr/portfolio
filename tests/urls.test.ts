import assert from "node:assert/strict";
import test from "node:test";
import { validExternalUrl, validMediaUrl, repositoryAvailable } from "../lib/urls.ts";

test("external project links accept actual HTTP URLs and reject executable or credential URLs", () => {
  for (const url of ["https://github.com/example/project", "https://gitlab.com/example/project", "https://code.example.org/project"]) assert.equal(validExternalUrl(url), true);
  for (const url of [null, "", "/missing", "javascript:alert(1)", "data:text/html,test", "https://user:password@example.org"]) assert.equal(validExternalUrl(url), false);
});

test("private repositories remain unavailable even when a URL is configured", () => {
  assert.equal(repositoryAvailable({ repository_url: "https://gitlab.com/example/project", repository_visibility: "private" }), false);
  assert.equal(repositoryAvailable({ repository_url: null }), false);
  assert.equal(repositoryAvailable({ repository_url: "https://gitlab.com/example/project" }), true);
});

test("preview media supports local assets and external HTTP media without protocol-relative URLs", () => {
  assert.equal(validMediaUrl("/media/demo.mp4"), true);
  assert.equal(validMediaUrl("https://media.example.org/demo.mp4"), true);
  for (const url of [null, "//example.org/demo", "javascript:alert(1)", "/\\example.org/demo"]) assert.equal(validMediaUrl(url), false);
});
