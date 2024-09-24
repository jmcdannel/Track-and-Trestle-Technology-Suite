import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'
import log from '../core/logger.mjs';

const connect = ({ path, baudRate, handleMessage }) => {
  try {
    let port; 
    return new Promise(function(resolve, reject) {
      if (!path) reject({ message: '[SERIAL] No serial port specified' });
      log.await('[SERIAL] Attempting to connect to:', path);
      // Create a port
      port = new SerialPort({ path, baudRate, autoOpen: false });
      port.setEncoding('utf8');
      port.on('open', () => {
        log.start('[SERIAL] Serial port opened', path, baudRate);
        resolve(port);
      });
      const parser = port.pipe(new ReadlineParser())
      parser.on('data', handleMessage);      
      port.open(err => err 
        ? reject(`[SERIAL] Error opening port: ${err.message}`)
        : log.start('[SERIAL] open')
      );
    });
  } catch (err) {
    log.fatal('[SERIAL] Error opening port: ', err);
  }
}

const send = (_port, data) => {
  try {
    log.await('[SERIAL] writing to port', JSON.stringify(data));
    _port.write(`${JSON.stringify(data)}\n`, err => {
      if (err) {
        return log.error('[SERIAL] Error on write: ', err.message);
      }
      log.log('data written', data);
    });
  } catch (err) {
    log.fatal('[SERIAL] Error writing to port:', err);
  }
};

export default {
  connect,
  send
}