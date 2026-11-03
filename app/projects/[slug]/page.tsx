import { Suspense } from "react";
import { notFound } from "next/navigation";
import { projects } from "@/lib/portfolio";
import ProjectReelPage from "../reel-page";
import { PageLoading } from "../../loading-feedback";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug && item.status === "published");
  if (!project) notFound();
  return <Suspense fallback={<PageLoading />}><ProjectReelPage selected={project} /></Suspense>;
}
