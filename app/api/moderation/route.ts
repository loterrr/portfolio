import { interactionApi } from "@/lib/server/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = interactionApi.getModeration;
export const PATCH = interactionApi.moderate;
