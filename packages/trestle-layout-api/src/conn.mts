import { MongoClient } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { DB_CONNECTION, DB_NAME } from "./config.mts";

const connect = async () => {
  try {
    const client = new MongoClient();
    await client.connect(DB_CONNECTION);
    const db = await client.database(DB_NAME);
    console.log("[CONN] connected", DB_NAME);
    return db;
  } catch (e) {
    console.error("[CONN] ERROR:", e);
    console.error("[CONN] DB_CONNECTION:", DB_CONNECTION);
    throw e;
  }
}

const db = await connect();

export default db;
