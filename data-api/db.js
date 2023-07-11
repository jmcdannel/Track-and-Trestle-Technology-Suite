import { MongoClient, ServerApiVersion } from 'mongodb';
import { DB_CONNECTION, DB_NAME } from './constants.js';

const client = new MongoClient(DB_CONNECTION, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db(DB_NAME);

export default db;