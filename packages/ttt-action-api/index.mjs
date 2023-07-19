import log from './core/logger.mjs';
import 'dotenv/config';
import waitOn from 'wait-on';
import server from './core/server.mjs';
import interfaces from './communication/interfaces.mjs';

var opts = {
  resources: [
    'http://127.0.0.1:5001/',
  ],
  simultaneous: 1, // limit to 1 connection per resource at a time
  timeout: 30000, // timeout in ms, default Infinity
  tcpTimeout: 1000, // tcp timeout in ms, default 300ms
  window: 1000, // stabilization time in ms, default 750ms
  strictSSL: false,
  followRedirect: true
};

async function main() {
  console.log('@ttt/action-api', '[MAIN]');
  try {
    await waitOn(opts);
    await interfaces.connect();
    await server.connect();
  } catch (err) {
    log.fatal('main', err);
  }
}

await main();
