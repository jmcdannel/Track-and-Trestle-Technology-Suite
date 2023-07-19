import connect from './api.mts';
import { assertExists } from 'https://deno.land/std/testing/asserts.ts';

Deno.test({
  name: 'connect to `MongoClient`', 
  fn() {
    assertExists(connect);
  }
});
