export type GithubStats = {
  username: string;
  profileUrl: string;
  from: string;
  to: string;
  contributions: {
    total: number;
    activeDays: number;
    longestStreak: number;
    includesPrivate: boolean;
  };
  repositories: number;
  weeks: Array<{ days: Array<{ date: string; count: number; weekday: number; level: 0 | 1 | 2 | 3 | 4 }> }>;
  languages: Array<{ name: string; color: string; percent: number }>;
};

export type GithubGraphqlData = {
  user: {
    login: string;
    url: string;
    contributionsCollection: {
      restrictedContributionsCount: number;
      contributionCalendar: {
        weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number; weekday: number }> }>;
      };
    };
    repositories: {
      totalCount: number;
      nodes: Array<{
        isFork: boolean;
        languages: { edges: Array<{ size: number; node: { name: string; color: string | null } }> };
      }>;
    };
  } | null;
};

type ContributionDay = { date: string; count: number };
type ContributionWeek = { days: ReadonlyArray<ContributionDay> };
type Language = { name: string; color: string | null; size: number };
type LanguageRepository = { isFork: boolean; languages: ReadonlyArray<Language> };

const GITHUB_USERNAME = /^[a-z\d](?:[a-z\d-]{0,38})$/i;
const DAY = 86_400_000;
const OTHER_COLOR = "#6e7681";

export function githubUsername(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") return null;
    const username = url.pathname.split("/").filter(Boolean)[0] ?? "";
    return GITHUB_USERNAME.test(username) ? username : null;
  } catch {
    return null;
  }
}

export function summarizeContributions(weeks: ReadonlyArray<ContributionWeek>) {
  const counts = new Map<string, number>();
  for (const day of weeks.flatMap((week) => week.days)) {
    const count = Math.max(0, Math.trunc(day.count));
    if (!Number.isFinite(count)) continue;
    counts.set(day.date, (counts.get(day.date) ?? 0) + count);
  }
  const days = [...counts].sort(([a], [b]) => a.localeCompare(b));
  const total = days.reduce((sum, [, count]) => sum + count, 0);
  const activeDays = days.filter(([, count]) => count > 0).length;
  let longestStreak = 0;
  let streak = 0;
  let previous: number | null = null;
  for (const [date, count] of days) {
    const time = Date.parse(`${date}T00:00:00Z`);
    if (!Number.isFinite(time)) { previous = null; continue; }
    if (count > 0) {
      streak = previous !== null && time - previous === DAY ? streak + 1 : 1;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
    previous = time;
  }
  return { total, activeDays, longestStreak };
}

export function contributionLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (max <= 1) return 4;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export function aggregateLanguages(repositories: ReadonlyArray<LanguageRepository>) {
  const totals = new Map<string, { name: string; color: string; size: number }>();
  for (const repository of repositories) {
    if (repository.isFork) continue;
    for (const language of repository.languages) {
      if (!Number.isFinite(language.size) || language.size <= 0) continue;
      const name = language.name.trim();
      if (!name) continue;
      const key = name.toLowerCase();
      const current = totals.get(key);
      if (current) current.size += language.size;
      else totals.set(key, { name, color: language.color || "#8b949e", size: language.size });
    }
  }
  const total = [...totals.values()].reduce((sum, language) => sum + language.size, 0);
  if (!total) return [];
  const sorted = [...totals.values()].sort((a, b) => b.size - a.size);
  const languages = sorted.slice(0, 5).map((language) => ({
    name: language.name,
    color: language.color,
    percent: Math.round((language.size / total) * 100),
  }));
  const other = 100 - languages.reduce((sum, language) => sum + language.percent, 0);
  if (sorted.length > 5 && other > 0) languages.push({ name: "Other", color: OTHER_COLOR, percent: other });
  return languages;
}

export function toGithubStats(data: GithubGraphqlData, from: string, to: string): GithubStats | null {
  const user = data.user;
  if (!user) return null;
  const rawWeeks = user.contributionsCollection.contributionCalendar.weeks;
  const summary = summarizeContributions(rawWeeks.map((week) => ({
    days: week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
  })));
  const max = rawWeeks.reduce((highest, week) => week.contributionDays.reduce((weekHighest, day) => Math.max(weekHighest, day.contributionCount), highest), 0);
  const languages = aggregateLanguages(user.repositories.nodes.map((repository) => ({
    isFork: repository.isFork,
    languages: repository.languages.edges.map((edge) => ({
      name: edge.node.name,
      color: edge.node.color,
      size: edge.size,
    })),
  })));
  return {
    username: user.login,
    profileUrl: user.url,
    from,
    to,
    contributions: {
      ...summary,
      includesPrivate: user.contributionsCollection.restrictedContributionsCount > 0,
    },
    repositories: user.repositories.totalCount,
    weeks: rawWeeks.map((week) => ({
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        weekday: day.weekday,
        level: contributionLevel(day.contributionCount, max),
      })),
    })),
    languages,
  };
}
