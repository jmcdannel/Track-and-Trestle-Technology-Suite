import { Application } from 'https://deno.land/x/oak/mod.ts';
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import router from './routes.js';
import { API_PORT } from './constants.js';

const port = API_PORT;

export async function connect() {
  try {
    const app = new Application();
    app.use(oakCors());
    app.use(router.routes());
    app.use(router.allowedMethods());
    console.log('api server connected');
    await app.listen({ port });
  } catch (err) {
    console.error(err);
  }
}

export default {
  connect
};