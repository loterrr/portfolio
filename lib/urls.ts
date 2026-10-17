export function validExternalUrl(value?: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch { return false; }
}

export function validMediaUrl(value?: string | null) {
  if (!value || /[\\\u0000-\u001f]/.test(value)) return false;
  return (value.startsWith("/") && !value.startsWith("//")) || validExternalUrl(value);
}

export function repositoryAvailable(project: { repository_url?: string | null; repository_visibility?: "public" | "private" }) {
  return project.repository_visibility !== "private" && validExternalUrl(project.repository_url);
}
