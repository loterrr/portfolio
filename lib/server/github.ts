import { unstable_cache } from "next/cache";
import { profile } from "../portfolio.ts";
import { githubUsername, toGithubStats, type GithubGraphqlData, type GithubStats } from "../github.ts";

const ENDPOINT = "https://api.github.com/graphql";
const QUERY = `query PortfolioGithubStats($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    url
    contributionsCollection(from: $from, to: $to) {
      restrictedContributionsCount
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
      totalCount
      nodes {
        isFork
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}`;

async function request(username: string): Promise<GithubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured");
  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "loter-portfolio",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { login: username, from: from.toISOString(), to: to.toISOString() },
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  const payload = await response.json() as { data?: GithubGraphqlData; errors?: unknown[] };
  if (!payload.data || payload.errors?.length) throw new Error("GitHub returned an invalid response");
  const stats = toGithubStats(payload.data, from.toISOString(), to.toISOString());
  if (!stats) throw new Error("GitHub profile was not found");
  return stats;
}

const cachedRequest = unstable_cache(request, ["github-stats"], { revalidate: 21_600, tags: ["github-stats"] });

export async function getGithubStats(): Promise<GithubStats | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  const username = githubUsername(profile.socialLinks.github);
  if (!username) return null;
  try {
    return await cachedRequest(username);
  } catch {
    return null;
  }
}
