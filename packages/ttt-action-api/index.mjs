import 'dotenv/config';
import mqtt from './src/core/mqtt.mjs';
import interfaces from './src/communication/interfaces.mjs';
import log from './src/core/logger.mjs';

async function main() {
  try {
    mqtt.connect();
    await interfaces.connect();
  } catch (err) {
    log.fatal('main', err);
  }
}

await main();
