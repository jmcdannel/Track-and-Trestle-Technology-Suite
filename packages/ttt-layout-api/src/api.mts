import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import router from "./routes.mts";
// import dccJs from '@ttt/dcc-api'
import { API_PORT } from "./config.mts";

const port: number = API_PORT;

export async function connect() {
  try {
    const app = new Application();
    app.use(oakCors());
    app.use(router.routes());
    app.use(router.allowedMethods());
    console.log("[API]", "connected", port);
    await app.listen({ port });
    // await dccJs.connect();
  } catch (err) {
    console.error(err);
  }
}

export default connect;
