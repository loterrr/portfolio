import { redirect } from "next/navigation";
import { projectsFeedUrl, routeSearchParams } from "@/lib/project-navigation";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = routeSearchParams(await searchParams);
  return redirect(projectsFeedUrl(params));
}
