import { Suspense } from "react";
import Portfolio from "./portfolio";
import { redirect } from "next/navigation";
import { projectReelUrl, projectsFeedUrl, routeSearchParams } from "@/lib/project-navigation";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = routeSearchParams(await searchParams);
  const legacyProject = params.get("project");
  if (legacyProject) redirect(projectReelUrl(legacyProject, params));
  if (params.get("tab") === "Projects") redirect(projectsFeedUrl(params));
  return (
    <Suspense fallback={<main className="loading-shell" aria-label="Loading portfolio" />}>
      <Portfolio />
    </Suspense>
  );
}
