import { load } from "https://deno.land/std/dotenv/mod.ts";

const env = await load();

export const DB_CONNECTION = `mongodb+srv://${env["MONGO_DB_USR"]}:${
  env["MONGO_DB_PWD"]
}@trestlemongodb.p0zygcb.mongodb.net/?authMechanism=SCRAM-SHA-1`;
export const DB_NAME = "trestledb";
export const API_PORT = 5001;
export const LAYOUT_ID = "betatrack";

export default {
  DB_CONNECTION,
  DB_NAME,
  API_PORT,
};
