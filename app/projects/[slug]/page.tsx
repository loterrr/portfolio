import { Suspense } from "react";
import { notFound } from "next/navigation";
import { projects } from "@/lib/portfolio";
import ProjectReelPage from "../reel-page";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug && item.status === "published");
  if (!project) notFound();
  return <Suspense fallback={<main className="loading-shell" aria-label="Loading project reels" />}><ProjectReelPage selected={project} /></Suspense>;
}
