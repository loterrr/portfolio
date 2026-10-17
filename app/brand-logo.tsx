import type { ReactNode } from "react";
import { brandLogo, monochromeLogos } from "@/lib/brand-logos";

export default function BrandLogo({ name, size = 18, fallback = null }: { name: string; size?: number; fallback?: ReactNode }) {
  const logo = brandLogo(name);
  return logo ? <img className={`brand-logo${monochromeLogos.has(logo) ? " brand-logo-mono" : ""}`} src={`/brands/${logo}.svg`} width={size} height={size} alt="" aria-hidden="true" /> : fallback;
}
