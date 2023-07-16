import { SerialPort } from 'serialport';
import log from '../core/logger.mjs';


const connect = (com) => {
  return new Promise(function(resolve, reject) {
    const path = com.serial;
    const baudRate = com.baud;

    log.await('[SERIAL] attempting to connect to:', path);
    // Create a port
    const port = new SerialPort({
      path,
      baudRate,
      autoOpen: false,
    });

    port.open(function (err) {
      if (err) {
        reject(`[SERIAL] Error opening port: ${err.message}`);
        return;
      }
      log.start('[SERIAL] open');

      // Because there's no callback to write, write errors will be emitted on the port:
      port.write('main screen turn on\n');
    });

    // The open event is always emitted
    port.on('open', function() {
      // open logic
      log.start('[SERIAL] Serial port opened', path, baudRate);
      resolve(port);
    });
  });
}

const send = (port, data) => {
  log.await('[SERIAL] writing to port', JSON.stringify(data));
  port.write(`${JSON.stringify(data)}\n`, err => {
    if (err) {
      return log.error('[SERIAL] Error on write: ', err.message);
    }
    // log.log('data written', data);
  });
};

export default {
  connect,
  send
}