import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/lib/portfolio";
import { projectReelUrl, profileProjectsUrl, reconcileCategory, routeSearchParams } from "@/lib/project-navigation";
import { matchesTechnology } from "@/lib/technologies";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = routeSearchParams(await searchParams);
  const category = reconcileCategory(projects, null, params.get("category") ?? "");
  if (category) params.set("category", category);
  else params.delete("category");
  const first = projects.find((project) => project.status === "published" && (!category || project.category === category) && matchesTechnology(project, params.get("technology") ?? ""));
  if (first) redirect(projectReelUrl(first.slug, params));

  const fromTechnology = Boolean(params.get("technology"));
  return <main className="app-frame"><Link className="button button-outline" href={fromTechnology ? "/?tab=Tech+Stack" : profileProjectsUrl(params)}><ArrowLeft size={18} aria-hidden="true" />{fromTechnology ? "Back to Tech Stack" : "Back to profile"}</Link><div className="empty-state"><h1>No projects to show</h1><p>No published projects match these filters.</p>{(category || fromTechnology) && <Link className="text-link" href="/projects">Clear filters</Link>}</div></main>;
}
