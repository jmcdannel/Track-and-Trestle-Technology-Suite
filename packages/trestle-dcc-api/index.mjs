// import 'dotenv/config';
import waitOn from 'wait-on';
import server from './src/server.mjs';
import dcc from './src/dcc.mjs';

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
  console.log('@trestle-tt/trestle-tt-dcc-api', '[MAIN]');
  try {
    await waitOn(opts, () => console.trace('DCC waitOn'));
    await dcc.connect();
    await server.connect();
  } catch (err) {
    console.error('main', err);
    // log.fatal('main', err);
  }
}

await main();
