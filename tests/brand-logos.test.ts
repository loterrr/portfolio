import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { brandLogos, brandLogo } from "../lib/brand-logos.ts";

test("brand lookup uses exact brands and known product families", () => {
  assert.equal(brandLogo(" GitHub "), "github");
  assert.equal(brandLogo("LinkedIn"), "linkedin");
  assert.equal(brandLogo("Next.js"), "nextjs");
  assert.equal(brandLogo("Supabase Auth"), "supabase");
  assert.equal(brandLogo("@fastify/cors"), "fastify");
  assert.equal(brandLogo("RAG"), undefined);
  assert.equal(brandLogo("unknown"), undefined);
});

test("every mapped logo is a local SVG without scripts or external references", () => {
  for (const logo of new Set(Object.values(brandLogos))) {
    const svg = readFileSync(new URL(`../public/brands/${logo}.svg`, import.meta.url), "utf8");
    assert.match(svg, /<svg\b/);
    assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|javascript:)/i);
  }
});
