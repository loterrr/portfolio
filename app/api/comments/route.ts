import { interactionApi } from "@/lib/server/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = interactionApi.getComments;
export const POST = interactionApi.comment;
