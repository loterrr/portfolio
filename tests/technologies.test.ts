import assert from "node:assert/strict";
import test from "node:test";
import { buildTechnologyGroups, matchesTechnology, reconcileTechnology, technologyPlatform } from "../lib/technologies.ts";

const catalog = [
  { slug: "web", status: "published", tech_stack: ["React", " react ", "SQLite"] },
  { slug: "other-web", status: "published", tech_stack: ["REACT", "Python"] },
  { slug: "hidden", status: "draft", tech_stack: ["React", "Private tool"] },
];

test("mobile frameworks and on-device storage are separate from web technologies", () => {
  for (const name of ["Flutter", "Dart", "Riverpod", "SQLite", "Google ML Kit", " flutter "]) {
    assert.equal(technologyPlatform(name), "Mobile");
  }
  for (const name of ["React", "Next.js", "PostgreSQL", "PGlite", "Leaflet", "TypeScript"]) {
    assert.equal(technologyPlatform(name), "Web");
  }
});

test("technology cards count published projects once despite duplicate names or casing", () => {
  const groups = buildTechnologyGroups({ Frontend: ["React", "react", "TypeScript"], Databases: ["SQLite"] }, catalog);
  assert.deepEqual(groups.map((group) => group.category), ["Frontend", "Backend", "Databases", "AI / Machine Learning", "DevOps", "Tools", "Other"]);
  const frontend = groups[0].technologies;
  assert.deepEqual(frontend, [{ name: "React", projectCount: 2 }, { name: "TypeScript", projectCount: 0 }]);
  assert.equal(groups[2].technologies[0].projectCount, 1);
});

test("only curated main technologies appear, even when projects list extra dependencies", () => {
  const groups = buildTechnologyGroups({ Other: ["React"] }, catalog);
  const other = groups.find((group) => group.category === "Other")!.technologies;
  assert.deepEqual(other, [{ name: "React", projectCount: 2 }]);
  assert.equal(buildTechnologyGroups({}, catalog).flatMap((group) => group.technologies).length, 0);
});

test("product variants share one main card and preserve project filtering", () => {
  const projects = [{ slug: "one", status: "published", tech_stack: ["Docker Compose", "Docker", "Supabase Auth", "Supabase Storage", "pg"] }];
  const groups = buildTechnologyGroups({ DevOps: ["Docker", "Docker Compose"], Backend: ["Supabase"], Databases: ["PostgreSQL"] }, projects);
  assert.deepEqual(groups.find((group) => group.category === "DevOps")!.technologies, [{ name: "Docker", projectCount: 1 }]);
  assert.equal(groups.find((group) => group.category === "Backend")!.technologies[0].projectCount, 1);
  assert.equal(matchesTechnology(projects[0], "Supabase"), true);
  assert.equal(matchesTechnology(projects[0], "PostgreSQL"), true);
});

test("technology selection filters by real stack associations", () => {
  assert.equal(matchesTechnology(catalog[0], " react "), true);
  assert.equal(matchesTechnology(catalog[0], "Python"), false);
  assert.equal(matchesTechnology(catalog[0], ""), true);
});

test("direct project links clear incompatible technology filters and preserve compatible filters", () => {
  assert.equal(reconcileTechnology(catalog, "web", "Python"), "");
  assert.equal(reconcileTechnology(catalog, "web", "React"), "React");
  assert.equal(reconcileTechnology(catalog, null, "TypeScript"), "TypeScript");
});
