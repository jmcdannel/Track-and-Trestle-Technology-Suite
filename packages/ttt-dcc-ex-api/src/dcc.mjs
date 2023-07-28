import { SerialPort } from 'serialport';
import log from './logger.mjs';

let port;

const connect = () => {

  return new Promise(function(resolve, reject) {
    const path = '/dev/tty.usbmodem2301';
    const baudRate = 115200;

    log.await('[SERIAL] attempting to connect to:', path);
    // Create a port
    port = new SerialPort({
      path,
      baudRate,
      autoOpen: false,
    });

    port.open(function (err) {
      if (err) {
        log.fatal('[SERIAL] Error opening port: ', err.message);
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


const send = async (data) => {
  const cmd = `<${data}>\n`
  log.await('[SERIAL] writing to port', data);
  await port.write(cmd, err => {
    if (err) {
      return log.error('[SERIAL] Error on write: ', err.message);
    }
    log.log('data written', cmd);
  });
};

const handleMessage = async (msg) => {
  const { action, payload } = JSON.parse(msg);
  log.star('[DCC] handleMessage', action, payload);
  switch (action) {
    case 'power':
      send(payload);
      break;
    case 'throttle':
      sendSpeed(payload);
      break;
    case 'function':
      log.star('sendFunction',payload);
      sendFunction(payload);
      break;
    default:
      //noop
  }
}

const sendSpeed = ({ address, speed }) => {
  const direction = speed > 0 ? 1 : 0;
  const absSpeed = Math.abs(speed);
  log.star('sendSpeed', address, speed, direction);
  const cmd = `t 01 ${address} ${absSpeed} ${direction}`;
  send(cmd);
}

const sendFunction = ({ address, func, state }) => {
  log.star('sendFunction', address, func);
  const cmd = `F ${address} ${func} ${state ? 1 : 0}`;
  send(cmd);
}

const powerOn = () => {
  send('1');
}

const powerOff = () => {
  send('0');
}

export default {
  connect,
  send,
  sendSpeed,
  powerOn,
  powerOff,
  handleMessage
}