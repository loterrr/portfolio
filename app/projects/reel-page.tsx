"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MotionConfig } from "motion/react";
import { projects, type Project } from "@/lib/portfolio";
import { projectReelUrl, profileProjectsUrl, reconcileCategory } from "@/lib/project-navigation";
import { reconcileTechnology } from "@/lib/technologies";
import { useInteractions } from "@/lib/interactions";
import { Reels } from "../portfolio";

export default function ProjectReelPage({ selected }: { selected: Project }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeProject = projects.find((project) => project.status === "published" && pathname === `/projects/${project.slug}`) ?? selected;
  const searchParams = useSearchParams();
  const reactions = useInteractions();
  const category = reconcileCategory(projects, activeProject.slug, searchParams.get("category") ?? "");
  const technology = reconcileTechnology(projects, activeProject.slug, searchParams.get("technology") ?? "");
  const params = new URLSearchParams(searchParams.toString());
  if (category) params.set("category", category);
  else params.delete("category");
  if (technology) params.set("technology", technology);
  else params.delete("technology");
  const canonicalUrl = projectReelUrl(activeProject.slug, params);

  useEffect(() => {
    const current = searchParams.size ? `${pathname}?${searchParams}` : pathname;
    if (current !== canonicalUrl) router.replace(canonicalUrl, { scroll: false });
  }, [canonicalUrl, pathname, router, searchParams]);

  const select = useCallback((project: Project) => {
    const filters = new URLSearchParams();
    if (category) filters.set("category", category);
    if (technology) filters.set("technology", technology);
    window.history.replaceState(null, "", projectReelUrl(project.slug, filters));
  }, [category, technology]);

  return <MotionConfig reducedMotion="user"><Reels selected={activeProject} category={category} technology={technology} reactions={reactions} onSelect={select} onExit={() => router.replace(profileProjectsUrl(params), { scroll: false })} /></MotionConfig>;
}
