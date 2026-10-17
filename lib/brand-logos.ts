export const brandLogos: Record<string, string> = {
  github: "github", linkedin: "linkedin", react: "react", "next.js": "nextjs",
  typescript: "typescript", javascript: "javascript", html5: "html5", css3: "css3",
  "tailwind css": "tailwindcss", bootstrap: "bootstrap", jquery: "jquery",
  zustand: "zustand", postcss: "postcss", "radix ui": "radixui",
  "lucide react": "lucide", "framer motion": "framermotion", webrtc: "webrtc",
  "node.js": "nodejs", fastify: "fastify", fastapi: "fastapi", "express.js": "express",
  php: "php", python: "python", prisma: "prisma", supabase: "supabase",
  "supabase edge functions": "supabase", "supabase auth": "supabase", "supabase storage": "supabase",
  "@fastify/websocket": "fastify", "@fastify/cors": "fastify", "@fastify/helmet": "fastify",
  "@fastify/rate-limit": "fastify", "@fastify/jwt": "fastify", zod: "zod", pino: "pino",
  mysql: "mysql", postgresql: "postgresql", pg: "postgresql", sqlite: "sqlite", redis: "redis", openai: "openai",
  docker: "docker", "docker compose": "docker", kubernetes: "kubernetes",
  "github actions": "githubactions", apache: "apache", nginx: "nginx", vercel: "vercel",
  railway: "railway", git: "git", composer: "composer", vite: "vite", vitest: "vitest",
  "react testing library": "testinglibrary", "npm workspaces": "npm", eslint: "eslint",
  flutter: "flutter", dart: "dart", leaflet: "leaflet", "better auth": "betterauth",
  "tensorflow.js": "tensorflow", "mapbox gl js": "mapbox", render: "render",
};

export function brandLogo(name: string) {
  return brandLogos[name.trim().toLowerCase()];
}

export const monochromeLogos = new Set([
  "github", "fastify", "express", "prisma", "vercel", "framermotion",
  "radixui", "zod", "pino", "testinglibrary", "lucide", "webrtc", "openai", "leaflet", "betterauth", "mapbox", "render",
]);
