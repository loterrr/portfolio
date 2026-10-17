export const technologyCategories = ["Frontend", "Backend", "Databases", "AI / Machine Learning", "DevOps", "Tools", "Other"] as const;

type StackProject = { slug: string; status: string; tech_stack: string[] };
const technologyAliases: Record<string, string> = {
  "docker compose": "docker", pg: "postgresql",
  "supabase auth": "supabase", "supabase storage": "supabase", "supabase edge functions": "supabase",
};
const technologyKey = (name: string) => {
  const key = name.trim().toLowerCase();
  return technologyAliases[key] ?? key;
};

const mobileTechnologies = new Set(["flutter", "dart", "riverpod", "sqlite", "google ml kit"]);

export function technologyPlatform(name: string): "Web" | "Mobile" {
  return mobileTechnologies.has(technologyKey(name)) ? "Mobile" : "Web";
}

export function matchesTechnology(project: Pick<StackProject, "tech_stack">, technology: string) {
  return !technology.trim() || project.tech_stack.some((name) => technologyKey(name) === technologyKey(technology));
}

export function reconcileTechnology(projects: ReadonlyArray<StackProject>, slug: string | null, technology: string) {
  const selected = projects.find((project) => project.slug === slug && project.status === "published");
  return selected && !matchesTechnology(selected, technology) ? "" : technology.trim();
}

export function buildTechnologyGroups(configured: Record<string, string[]>, projects: ReadonlyArray<StackProject>) {
  const entries = new Map<string, { name: string; category: string; projectCount: number }>();
  for (const [category, names] of Object.entries(configured)) {
    for (const name of names) {
      const key = technologyKey(name);
      if (key && !entries.has(key)) entries.set(key, { name: name.trim(), category, projectCount: 0 });
    }
  }
  for (const project of projects) {
    if (project.status !== "published") continue;
    const counted = new Set<string>();
    for (const name of project.tech_stack) {
      const key = technologyKey(name);
      if (!key || counted.has(key) || !entries.has(key)) continue;
      counted.add(key);
      entries.get(key)!.projectCount++;
    }
  }
  return technologyCategories.map((category) => ({
    category,
    technologies: Array.from(entries.values())
      .filter((item) => item.category === category || (category === "Other" && !technologyCategories.some((known) => known === item.category)))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, projectCount }) => ({ name, projectCount })),
  }));
}
