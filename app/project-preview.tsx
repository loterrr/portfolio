"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, ImageIcon } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { validMediaUrl } from "@/lib/urls";
import ImagePreview from "./image-preview";

export default function ProjectPreview({ project, active }: { project: Project; active: boolean }) {
  const images = (project.details.gallery ?? []).filter((image) => validMediaUrl(image.url));
  if (validMediaUrl(project.thumbnail_url) && !images.some((image) => image.url === project.thumbnail_url)) {
    images.unshift({ url: project.thumbnail_url!, alt: `${project.title} project preview` });
  }
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [held, setHeld] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pointerStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const image = images[index];

  useEffect(() => {
    if (!active || expanded || hovered || focused || held || images.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % images.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active, expanded, hovered, focused, held, images.length, index]);

  function move(direction: number) {
    setIndex((current) => (current + direction + images.length) % images.length);
  }

  return <><div className="reel-preview" role="region" aria-roledescription="carousel" aria-label={`${project.title} previews`}
    tabIndex={image ? 0 : undefined}
    aria-description={image ? images.length > 1 ? "Tap the center or press Enter to open the full image. Tap the edges or swipe to change preview. Hold to pause. Use Left and Right arrow keys when focused." : "Tap or press Enter to open the full image." : undefined}
    onPointerDown={(event) => {
      if (!event.isPrimary || event.button !== 0 || !image || failedUrl === image.url || (event.target as Element).closest("button") || pointerStart.current) return;
      pointerStart.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
      setHeld(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerUp={(event) => {
      const start = pointerStart.current;
      if (!event.isPrimary || !start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (images.length > 1 && Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && event.timeStamp - start.time < 500) {
        const box = event.currentTarget.getBoundingClientRect();
        const position = (event.clientX - box.left) / box.width;
        if (images.length < 2 || (position >= 0.25 && position <= 0.75)) setExpanded(true);
        else move(position < 0.25 ? -1 : 1);
      }
      pointerStart.current = null;
      setHeld(false);
    }}
    onPointerCancel={() => { pointerStart.current = null; setHeld(false); }}
    onLostPointerCapture={() => { pointerStart.current = null; setHeld(false); }}
    onKeyDown={(event) => {
      if (event.target === event.currentTarget && image && ["Enter", " "].includes(event.key)) {
        event.preventDefault();
        setExpanded(true);
        return;
      }
      if (images.length < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={(event) => { if (event.pointerType === "mouse") setHovered(false); }}
    onContextMenu={(event) => { if (held) event.preventDefault(); }}
    onFocusCapture={(event) => setFocused(event.target.matches(":focus-visible"))} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {image ? failedUrl === image.url
      ? <div className="reel-preview-empty"><ImageIcon size={34} /><span>Image unavailable</span></div>
      : <img className="preview-image" src={image.url} alt={image.alt} draggable={false} onError={() => setFailedUrl(image.url)} />
      : <div className="reel-preview-empty"><Code2 size={34} /><span>Project preview</span></div>}
    {images.length > 1 && <>
      <div className="preview-dots" role="group" aria-label="Choose preview">{images.map((item, position) => <button type="button" key={item.url} className="preview-dot" aria-label={`Show preview ${position + 1} of ${images.length}`} aria-current={index === position ? "true" : undefined} onClick={() => setIndex(position)}><span /></button>)}</div>
    </>}
  </div>{expanded && image && <ImagePreview image={image} onClose={() => setExpanded(false)} />}</>;
}
