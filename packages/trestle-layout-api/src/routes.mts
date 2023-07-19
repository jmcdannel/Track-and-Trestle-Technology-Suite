import { Router } from "https://deno.land/x/oak/mod.ts";
import layouts from "./modules/layouts.mts";
import locos from "./modules/locos.mts";
import effects from "./modules/effects.mts";
import turnouts from "./modules/turnouts.mts";
import routes from "./modules/routes.mts";

const router = new Router();

const sendResponse = (response: any, body: any) => {
  response.type = "application/json";
  response.body = body;
};

// create a root route
router.get("/", ({ response }) => sendResponse(response, ["/api"]));

// create a root api route
router.get(
  "/api",
  ({ response }) => sendResponse(response, ["/layouts", "/layouts/:id"]),
);

// create a route for getting all layouts
router.get("/api/layouts", layouts.handleGetAll);

// create a route for getting a single layout
router.get("/api/layouts/:layoutId", layouts.handleGetById);

// create a route for getting all locos
router.get("/api/:layoutId/locos", locos.handleGetAll);

// create a route for getting a single locos
router.get("/api/:layoutId/locos/:id", locos.handleGetById);

// create a route for getting all effects
router.get("/api/:layoutId/effects", effects.handleGetAll);

// create a route for getting a single effect
router.get("/api/:layoutId/effects/:id", effects.handleGetById);

// create a route for getting all turnouts
router.get("/api/:layoutId/turnouts", turnouts.handleGetAll);

// create a route for getting a single turnout
router.get("/api/:layoutId/turnouts/:id", turnouts.handleGetById);

// create a route for getting all routes
router.get("/api/:layoutId/routes", routes.handleGetAll);

// create a route for getting a single route
router.get("/api/:layoutId/routes/:id", routes.handleGetById);

export default router;
