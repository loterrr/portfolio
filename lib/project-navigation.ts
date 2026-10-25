export function reconcileCategory(
  projects: ReadonlyArray<{ slug: string; category: string; status: string }>,
  slug: string | null,
  category: string,
) {
  const published = projects.filter((project) => project.status === "published");
  const selected = published.find((project) => project.slug === slug);
  if (selected && category && selected.category !== category) return selected.category;
  return published.some((project) => project.category === category) ? category : "";
}

function projectRoute(path: string, values: URLSearchParams) {
  const params = new URLSearchParams(values);
  params.delete("tab");
  params.delete("project");
  return params.size ? `${path}?${params}` : path;
}

export function projectReelUrl(slug: string, params: URLSearchParams) {
  return projectRoute(`/projects/${encodeURIComponent(slug)}`, params);
}

function profileTabUrl(values: URLSearchParams, tab: string) {
  const params = new URLSearchParams();
  params.set("tab", tab);
  for (const [key, value] of values) {
    if (key !== "tab" && key !== "project") params.set(key, value);
  }
  return `/?${params}`;
}

export function projectsFeedUrl(params: URLSearchParams) {
  return profileTabUrl(params, "Projects");
}

export function profileProjectsUrl(params: URLSearchParams) {
  return profileTabUrl(params, "Projects");
}

export function routeSearchParams(values: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") params.set(key, value);
  }
  return params;
}
