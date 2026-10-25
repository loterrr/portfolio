"use client";

import { BrainCircuit, Code2, Database, Layers, Server, Workflow, Wrench } from "lucide-react";
import { useState } from "react";
import { technologyPlatform, type buildTechnologyGroups } from "@/lib/technologies";
import BrandLogo from "./brand-logo";

const categoryIcons = [Code2, Server, Database, BrainCircuit, Workflow, Wrench, Layers];
const workflowTools = new Set(["Claude", "OpenCode", "Gemini", "OpenAI", "DeepSeek", "GLM"]);

export default function TechStack({ groups, onSelect }: {
  groups: ReturnType<typeof buildTechnologyGroups>;
  onSelect: (technology: string, platform: "Web" | "Mobile") => void;
}) {
  const [platform, setPlatform] = useState<"Web" | "Mobile">("Web");
  return <>
    <div className="section-head"><div><h2>Tech stack</h2><p>My main technologies. Select one to explore its projects.</p></div></div>
    <div className="filters" role="group" aria-label="Technology platform">
      {(["Web", "Mobile"] as const).map((item) => <button key={item} className={platform === item ? "selected" : ""} aria-pressed={platform === item} onClick={() => setPlatform(item)}>{item === "Mobile" ? "Mobile / App" : "Web"}</button>)}
    </div>
    <div className="technology-groups">{groups.map((group, index) => {
      const technologies = group.technologies.filter((technology) => technologyPlatform(technology.name) === platform);
      if (!technologies.length) return null;
      const Icon = categoryIcons[index];
      return <section className="technology-group" key={group.category} aria-labelledby={`technology-group-${index}`}>
        <h3 id={`technology-group-${index}`}>{group.category}</h3>
        <div className="technology-grid">{technologies.map((technology) => {
          const workflow = workflowTools.has(technology.name);
          const countLabel = technology.projectCount > 0
            ? `${technology.projectCount} published ${technology.projectCount === 1 ? "project" : "projects"}`
            : workflow ? "Used in workflow" : "No linked projects";
          return <button
            className="technology-card" key={technology.name} disabled={technology.projectCount === 0} onClick={() => onSelect(technology.name, platform)}
            aria-label={technology.projectCount === 0 ? `${technology.name}: ${workflow ? "used in workflow, no linked projects" : "no linked projects yet"}` : `View projects using ${technology.name}: ${technology.projectCount} published ${technology.projectCount === 1 ? "project" : "projects"}`}
          >
            <span className="technology-icon" aria-hidden="true"><BrandLogo name={technology.name} size={24} fallback={<Icon size={22} strokeWidth={1.5} />} /></span>
            <strong>{technology.name}</strong>
            <span className="technology-count">{countLabel}</span>
          </button>;
        })}</div>
      </section>;
    })}</div>
  </>;
}
