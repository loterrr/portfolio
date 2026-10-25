import { Suspense } from "react";
import Portfolio from "./portfolio";
import { redirect } from "next/navigation";
import { projectReelUrl, routeSearchParams } from "@/lib/project-navigation";
import { getGithubStats } from "@/lib/server/github";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = routeSearchParams(await searchParams);
  const legacyProject = params.get("project");
  if (legacyProject) redirect(projectReelUrl(legacyProject, params));
  const githubStats = await getGithubStats();
  return (
    <Suspense fallback={<main className="loading-shell" aria-label="Loading portfolio" />}>
      <Portfolio githubStats={githubStats} />
    </Suspense>
  );
}
