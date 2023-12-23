import { SerialPort } from 'serialport';
import log from '../core/logger.mjs';

let isConnected = false;
let port;

const connect = async (com) => {
  if (isConnected) {
    return Promise.resolve(com.connection);
  } else {
    return new Promise(function(resolve, reject) {

      const path = com.serial;
      const baudRate = com.baudRate;

      if (!path) reject('[SERIAL] No serial port specified');

      log.await('[SERIAL] attempting to connect to:', path);

      const handleOpen = err => {
        if (err) {
          reject(`[SERIAL] Error opening port: ${err.message}`);
          return;
        }
        log.start('[SERIAL] open');

        isConnected = true;
      }

      const handleOpened = async () => {
        log.start('[SERIAL] Serial port opened', path, baudRate);
        resolve(port);
      }
      
      // Create a port
      port = new SerialPort({ path, baudRate, autoOpen: false });
      port.open(handleOpen);
      port.on('open', handleOpened);

      log.info('[SERIAL] port', port.isOpen, port.settings);

    });
  }
}

const send = (_port, data) => {
  log.await('[SERIAL] writing to port', JSON.stringify(data));
  port.write(`${JSON.stringify(data)}\n`, err => {
    if (err) {
      return log.error('[SERIAL] Error on write: ', err.message);
    }
    log.log('data written', data);
  });
};

export default {
  connect,
  send
}