"use client";

import { useId } from "react";
import { X } from "lucide-react";
import Modal from "./modal";

export default function ImagePreview({ image, onClose }: { image: { url: string; alt: string; caption?: string }; onClose: () => void }) {
  const labelId = useId();
  return <Modal kind="image" labelId={labelId} onClose={onClose}>
    <button type="button" className="icon-button image-viewer-close" onClick={onClose} aria-label="Close image preview"><X size={22} /></button>
    <figure className="image-viewer">
      <span id={labelId} className="sr-only">{image.alt}</span>
      <img src={image.url} alt={image.alt} decoding="async" />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  </Modal>;
}
