"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ImageIcon, X } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/lib/portfolio";
import { repositoryAvailable, validExternalUrl, validMediaUrl } from "@/lib/urls";
import Modal from "./modal";
import BrandLogo from "./brand-logo";
import ImagePreview from "./image-preview";

function Gallery({ images }: { images: NonNullable<Project["details"]["gallery"]> }) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const image = images[index];
  function select(next: number) { setFailed(false); setIndex(next); }

  return <section className="case-gallery" aria-label="Project media gallery">
    <h3>Gallery</h3>
    <figure>{failed ? <div className="gallery-unavailable"><ImageIcon size={24} /><p>Image unavailable</p></div> : <button type="button" className="gallery-image-button" onClick={() => setExpanded(true)} aria-label={`Open full-size image: ${image.alt}`}><img key={image.url} src={image.url} alt={image.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} /></button>}{image.caption && <figcaption>{image.caption}</figcaption>}</figure>
    {images.length > 1 && <div className="gallery-navigation"><button className="icon-button" disabled={index === 0} onClick={() => select(index - 1)} aria-label="Previous screenshot"><ArrowLeft size={18} /></button><span aria-live="polite">{index + 1} / {images.length}</span><button className="icon-button" disabled={index === images.length - 1} onClick={() => select(index + 1)} aria-label="Next screenshot"><ArrowRight size={18} /></button></div>}
    {expanded && <ImagePreview image={image} onClose={() => setExpanded(false)} />}
  </section>;
}

export default function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const details = project.details;
  const gallery = details.gallery?.filter((image) => validMediaUrl(image.url)) ?? [];
  return <Modal kind="details" labelId="details-title" onClose={onClose}>
    <motion.section className="details-panel" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
      <button className="icon-button details-close" onClick={onClose} aria-label="Close details"><X size={20} /></button>
      <h2 id="details-title">{project.title}</h2>
      {project.description && <><h3>Overview</h3><p>{project.description}</p></>}
      {details.problem && <><h3>Problem</h3><p>{details.problem}</p></>}
      {details.solution && <><h3>Solution</h3><p>{details.solution}</p></>}
      {details.features.length > 0 && <><h3>Key features</h3><ul>{details.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></>}
      {project.tech_stack.length > 0 && <><h3>Technology stack</h3><div className="tag-list">{project.tech_stack.map((tag) => <span className="tag" key={tag}><BrandLogo name={tag} size={13} />{tag}</span>)}</div></>}
      {details.architecture && <><h3>System architecture</h3><p>{details.architecture}</p></>}
      {details.process && <><h3>Development process</h3><p>{details.process}</p></>}
      {details.challenges && <><h3>Challenges & solutions</h3><p>{details.challenges}</p></>}
      {Boolean(details.outcomes?.length) && <><h3>Results & outcomes</h3><ul>{details.outcomes!.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></>}
      {gallery.length > 0 && <Gallery images={gallery} />}
      {(validExternalUrl(project.live_url) || repositoryAvailable(project)) && <div className="details-links">
        {validExternalUrl(project.live_url) && <a href={project.live_url!} target="_blank" rel="noopener noreferrer">Live View <ArrowRight size={15} /></a>}
        {repositoryAvailable(project) && <a href={project.repository_url!} target="_blank" rel="noopener noreferrer">Source Code <ArrowRight size={15} /></a>}
      </div>}
    </motion.section>
  </Modal>;
}
