import { Router } from 'https://deno.land/x/oak/mod.ts';
import layouts from './modules/layouts.js';
import locos from './modules/locos.js';
import effects from './modules/effects.js';

const router = new Router();

router.get('/', ({ response }) => {
  response.type = "application/json";
  response.body = [{ msg: 'Hello World' }];
});
router.get('/api', ({ response }) => {
  console.log('Hello API');
  response.type = "application/json";
  response.body = {
    api: {
      '/layouts': 'get all layouts',
      '/layouts/:id': 'get a single layout'
    }
  };
});

// create a route for getting all layouts
router.get('/api/layouts', layouts.handleGetAll)

// create a route for getting a single layout
router.get('/api/layouts/:layoutId', layouts.handleGetById);

// create a route for getting all locos
router.get('/api/:layoutId/locos', locos.handleGetAll)

// create a route for getting a single locos
router.get('/api/:layoutId/locos/:locoId', locos.handleGetById);

// create a route for getting all effects
router.get('/api/:layoutId/effects', effects.handleGetAll)

// create a route for getting a single effect
router.get('/api/:layoutId/effects/:id', effects.handleGetById);


export default router;