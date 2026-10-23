import assert from "node:assert/strict";
import test from "node:test";
import {
  aggregateLanguages,
  contributionLevel,
  githubUsername,
  summarizeContributions,
  toGithubStats,
} from "../lib/github.ts";

test("github username comes from a profile URL", () => {
  assert.equal(githubUsername("https://github.com/loterrr"), "loterrr");
  assert.equal(githubUsername("https://www.github.com/loterrr/"), "loterrr");
  assert.equal(githubUsername("https://github.com/loterrr?tab=repositories"), "loterrr");
  assert.equal(githubUsername("https://example.com/loterrr"), null);
  assert.equal(githubUsername("not a url"), null);
  assert.equal(githubUsername(""), null);
});

test("contribution summary counts active days and the longest streak", () => {
  const summary = summarizeContributions([
    { days: [
      { date: "2026-01-01", count: 1 },
      { date: "2026-01-02", count: 2 },
      { date: "2026-01-03", count: 0 },
      { date: "2026-01-04", count: 3 },
      { date: "2026-01-05", count: 4 },
    ] },
    { days: [{ date: "2026-01-06", count: 5 }] },
  ]);
  assert.deepEqual(summary, { total: 15, activeDays: 5, longestStreak: 3 });
});

test("contribution summary handles empty calendars", () => {
  assert.deepEqual(summarizeContributions([]), { total: 0, activeDays: 0, longestStreak: 0 });
});

test("contribution levels scale from empty to the busiest day", () => {
  assert.equal(contributionLevel(0, 8), 0);
  assert.equal(contributionLevel(1, 8), 1);
  assert.equal(contributionLevel(2, 8), 1);
  assert.equal(contributionLevel(3, 8), 2);
  assert.equal(contributionLevel(6, 8), 3);
  assert.equal(contributionLevel(8, 8), 4);
  assert.equal(contributionLevel(1, 1), 4);
});

test("language totals ignore forks and keep the five largest languages", () => {
  const languages = aggregateLanguages([
    { isFork: false, languages: [
      { name: "TypeScript", color: "#3178c6", size: 600 },
      { name: "JavaScript", color: "#f1e05a", size: 200 },
      { name: "CSS", color: "#563d7c", size: 100 },
    ] },
    { isFork: false, languages: [
      { name: "TypeScript", color: "#3178c6", size: 100 },
      { name: "Python", color: "#3572A5", size: 50 },
      { name: "HTML", color: "#e34c26", size: 30 },
      { name: "Shell", color: "#89e051", size: 20 },
    ] },
    { isFork: true, languages: [{ name: "Dart", color: "#00B4AB", size: 9999 }] },
  ]);
  assert.equal(languages.length, 6);
  assert.equal(languages[0].name, "TypeScript");
  assert.equal(languages[0].percent, 64);
  assert.equal(languages.at(-1)?.name, "Other");
  assert.equal(languages.reduce((sum, language) => sum + language.percent, 0), 100);
  assert.equal(languages.some((language) => language.name === "Dart"), false);
});

test("language totals omit the Other slice when five languages cover everything", () => {
  const languages = aggregateLanguages([
    { isFork: false, languages: [
      { name: "TypeScript", color: "#3178c6", size: 60 },
      { name: "JavaScript", color: "#f1e05a", size: 20 },
      { name: "CSS", color: "#563d7c", size: 10 },
      { name: "Python", color: "#3572A5", size: 5 },
      { name: "HTML", color: "#e34c26", size: 5 },
    ] },
  ]);
  assert.deepEqual(languages.map((language) => language.name), ["TypeScript", "JavaScript", "CSS", "Python", "HTML"]);
});

test("GraphQL data maps to the public stats shape", () => {
  const stats = toGithubStats({
    user: {
      login: "loterrr",
      url: "https://github.com/loterrr",
      contributionsCollection: {
        restrictedContributionsCount: 2,
        contributionCalendar: {
          weeks: [{ contributionDays: [
            { date: "2026-01-01", contributionCount: 1, weekday: 4 },
            { date: "2026-01-02", contributionCount: 0, weekday: 5 },
            { date: "2026-01-03", contributionCount: 2, weekday: 6 },
          ] }],
        },
      },
      repositories: {
        totalCount: 14,
        nodes: [
          { isFork: false, languages: { edges: [
            { size: 80, node: { name: "TypeScript", color: "#3178c6" } },
            { size: 20, node: { name: "Python", color: "#3572A5" } },
          ] } },
          { isFork: true, languages: { edges: [
            { size: 999, node: { name: "Dart", color: "#00B4AB" } },
          ] } },
        ],
      },
    },
  }, "2025-10-23T00:00:00Z", "2026-10-23T00:00:00Z");
  assert.ok(stats);
  assert.equal(stats.contributions.total, 3);
  assert.equal(stats.contributions.activeDays, 2);
  assert.equal(stats.contributions.longestStreak, 1);
  assert.equal(stats.contributions.includesPrivate, true);
  assert.equal(stats.repositories, 14);
  assert.deepEqual(stats.weeks[0].days.map((day) => day.level), [2, 0, 4]);
  assert.deepEqual(stats.languages, [
    { name: "TypeScript", color: "#3178c6", percent: 80 },
    { name: "Python", color: "#3572A5", percent: 20 },
  ]);
});
