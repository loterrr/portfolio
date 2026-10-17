import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { projects } from "../portfolio.ts";
import { openDatabase } from "./database.ts";
import { createInteractionApi } from "./interaction-api.ts";

let database: ReturnType<typeof openDatabase> | undefined;

function getDatabase() {
  if (!database) {
    const directory = join(process.cwd(), "data");
    mkdirSync(directory, { recursive: true });
    database = openDatabase(join(directory, "scrollfolio.sqlite"), projects);
  }
  return database;
}

export const interactionApi = createInteractionApi(getDatabase);
