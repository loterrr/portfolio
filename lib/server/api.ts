import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { projects } from "../portfolio.ts";
import { openDatabase } from "./database.ts";
import { openSupabaseDatabase } from "./supabase-database.ts";
import { createInteractionApi } from "./interaction-api.ts";

let database: Promise<Awaited<ReturnType<typeof openSupabaseDatabase>> | ReturnType<typeof openDatabase>> | undefined;

function getDatabase() {
  if (!database) {
    database = Promise.resolve().then(async () => {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) return openSupabaseDatabase(supabaseUrl, supabaseKey, projects);
      const directory = join(process.cwd(), "data");
      mkdirSync(directory, { recursive: true });
      return openDatabase(join(directory, "scrollfolio.sqlite"), projects);
    }).catch((error) => { database = undefined; throw error; });
  }
  return database;
}

export const interactionApi = createInteractionApi(getDatabase);
