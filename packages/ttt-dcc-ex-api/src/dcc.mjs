import { SerialPort } from 'serialport';
import log from './utils/logger.mjs';
import getPorts from './utils/listPorts.mjs';
import server from './server.mjs';

let port;
let isConnected = false;

const connect = async (payload) => {
  try {

    log.star('[SERIAL] connect', payload);
    const path = payload.serial;
    const baudRate = 115200;
    if (isConnected) {
      await server.send({ 'action': 'connected', payload: { serial: path, baudRate } });
      return Promise.resolve(true);
    }

    return new Promise(function(resolve, reject) {

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

        isConnected = true;

        // Because there's no callback to write, write errors will be emitted on the port:
        port.write('main screen turn on\n');
      });

      // The open event is always emitted
      port.on('open', async function() {
        // open logic
        log.start('[SERIAL] Serial port opened', path, baudRate);
        await server.send({ 'action': 'connected', payload: { serial: path, baudRate } });
        resolve(port);
      });
    });

  } catch (err) {
    log.fatal('[SERIAL] Error opening port: ', err.message);
  }
}

const listPorts = async () => {
  const payload = await getPorts();
  server.send({ 'action': 'listPorts', payload });
  log.info('[SERIAL] listPorts', payload);
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
    case 'connect':
      connect(payload);
      break;
    case 'listPorts':
      listPorts(payload);
      break;
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