import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'
import log from '../core/logger.mjs';


const connect = (com) => {

  log.debug('[CMDEX] connect');

  return new Promise(function(resolve, reject) {
    const path = com.serial;
    const baudRate = com.baud;

    log.await('[CMDEX] attempting to connect to', path);
    // Create a port
    const port = new SerialPort({
      path,
      baudRate,
      autoOpen: false,
    });

    const parser = port.pipe(new ReadlineParser());
    parser.on('data', (data) => {
      log.watch(data, data.indexOf('DCC++ EX') > -1);
      data.indexOf('DCC++ EX') > -1 && resolve(port);
    })

    port.open(function (err) {
      if (err) {
        reject(`[CMDEX] Error opening port: ${err.message}`);
        return;
      }

      // Because there's no callback to write, write errors will be emitted on the port:
      port.write('[CMDEX] main screen turn on\n');
    });

    // The open event is always emitted
    port.on('open', function() {
      // open logic
      log.start('[CMDEX] Serial port open', path, baudRate);
      send(port, '<s>');
    });

    // Read data that is available but keep the stream in "paused mode"
    // port.on('readable', function () {
    //   log.log('[CMDEX] portRead:', port.read());
    // });

    // Switches the port into "flowing mode"
    // port.on('data', function (data) {
    //   log.log('[CMDEX] Data:', data);
    //   resolve(port);
    // });
  });
}

const send = (port, data) => {
  log.await('[CMDEX] writing to port', data);
  port.write(`${data}\n`, err => {
    if (err) {
      return log.error('Error on write: ', err.message);
    }
    // log.log('data written', data);
  });
};

export default {
  connect,
  send
}