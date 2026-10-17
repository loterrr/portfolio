"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, ImageIcon, Pause, Play } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { validMediaUrl } from "@/lib/urls";

export default function ProjectPreview({ project, active }: { project: Project; active: boolean }) {
  const images = (project.details.gallery ?? []).filter((image) => validMediaUrl(image.url));
  if (validMediaUrl(project.thumbnail_url) && !images.some((image) => image.url === project.thumbnail_url)) {
    images.unshift({ url: project.thumbnail_url!, alt: `${project.title} project preview` });
  }
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const image = images[index];

  useEffect(() => {
    if (!active || paused || hovered || focused || images.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % images.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active, paused, hovered, focused, images.length, index]);

  return <div className="reel-preview" role="region" aria-roledescription="carousel" aria-label={`${project.title} previews`}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {image ? failedUrl === image.url
      ? <div className="reel-preview-empty"><ImageIcon size={34} /><span>Image unavailable</span></div>
      : <img className="preview-image" src={image.url} alt={image.alt} onError={() => setFailedUrl(image.url)} />
      : <div className="reel-preview-empty"><Code2 size={34} /><span>Project preview</span></div>}
    {images.length > 1 && <>
      <button type="button" className="preview-arrow preview-previous" aria-label="Previous preview" onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)}><ArrowLeft size={20} /></button>
      <button type="button" className="preview-arrow preview-next" aria-label="Next preview" onClick={() => setIndex((current) => (current + 1) % images.length)}><ArrowRight size={20} /></button>
      <div className="preview-dots" role="group" aria-label="Choose preview">{images.map((item, position) => <button type="button" key={item.url} className="preview-dot" aria-label={`Show preview ${position + 1} of ${images.length}`} aria-current={index === position ? "true" : undefined} onClick={() => setIndex(position)}><span /></button>)}</div>
      <button type="button" className="video-toggle preview-toggle" aria-label={paused ? "Play preview slideshow" : "Pause preview slideshow"} onClick={() => setPaused((current) => !current)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
    </>}
  </div>;
}
