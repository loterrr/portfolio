import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { projects } from "../portfolio.ts";
import { openDatabase } from "./database.ts";
import { openSupabaseDatabase } from "./supabase-database.ts";
import { createInteractionApi } from "./interaction-api.ts";

let database: ReturnType<typeof openDatabase> | ReturnType<typeof openSupabaseDatabase> | undefined;

function getDatabase() {
  if (!database) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      database = openSupabaseDatabase(supabaseUrl, supabaseKey);
    } else {
      const directory = join(process.cwd(), "data");
      mkdirSync(directory, { recursive: true });
      database = openDatabase(join(directory, "scrollfolio.sqlite"), projects);
    }
  }
  return database;
}

export const interactionApi = createInteractionApi(getDatabase);
