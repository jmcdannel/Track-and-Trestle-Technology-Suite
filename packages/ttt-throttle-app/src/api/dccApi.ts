import { useConnectionStore } from '../store/connectionStore.jsx';
let wsDCC;
let connectionId;
let serial;
let queue = [];

const defaultProtocol = 'ws';
const defaultPort = 8082;

async function processQueeue() {
  console.log('[DCC API] processQueeue', queue);
  queue.map(async ({ action, payload }) => {
    await sendRaw(JSON.stringify({ action, payload  }));
  });
  queue = [];
}

async function onOpen() {
  const connStore = useConnectionStore();
  await connStore.setConnection(connectionId, { api: true });
  processQueeue();

}

async function connectSerial() {
  if (serial) {
    await send('connect', { serial });
  }
}

function onError(event) {
  console.log('[DCC API] Websocket error', event);
}

async function onMessage(event) {
  try {
    const { action, payload } = JSON.parse(event.data);
    const connStore = useConnectionStore();
    console.log('[DCC API] onMessage', action, payload);
    switch (action) {
      case 'listPorts':
        await connStore.setConnection(connectionId, { ports: payload });
        break;
      case 'socketConnected':
        connectSerial();
        await connStore.setConnection(connectionId, { connected: true });
        break;
      case 'connected':
        console.log('onMessage.connected', serial);
        await connStore.setConnection(connectionId, { connected: true });

        // try {   
        //   await send('output', [{ id: 50, pin: 50  }]);
        // } catch (err) {
        //   console.error('[DCC API].setPower', err);
        //   throw new Error('Unable to read', err, type);
        // }
        break;
    }
  } catch { 
    console.warn('Message not in JSON format.', event.data); 
  }
}

async function connect(host, iface, _serial) {
  connectionId = iface?.id;
  serial = _serial;
  console.log('[DCC API] connect', host, iface?.id, connectionId, serial);
  wsDCC = new WebSocket(`${defaultProtocol}://${host}:${defaultPort}`);
  wsDCC.onerror = onError;
  wsDCC.addEventListener('open', onOpen);   
  wsDCC.addEventListener('message',  onMessage);
}

async function setPower(payload) {
  try {   
    console.log('[DCC API].setPower', payload);
    await send('power', payload);
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err);
  }
}

async function setSpeed(address, speed) {
  try {   
    await send('throttle', { address, speed });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err);
  }
}

async function setFunction(address, func) {
  try {   
    await send({
      action: 'function', payload: { address, func }
    });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err);
  }
}

async function sendOutput(pin, state) {
  try {   
    console.log('[DCC API].sendOutput', pin, state);
    await send( 'output', { pin, state });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, pin, state);
  }
}

async function send(action, payload) {
  try { 
    if (wsDCC) {  
      await wsDCC.send(JSON.stringify({ action, payload  }));
    } else {
      queue.push({ action, payload });
      throw new Error('Not connected', connectionId);
    }
  } catch (err) {
    console.error('[DCC API].send', err);
  }
}

function getConnectionId() {
  return connectionId;
}

export const dccApi = {
  connect,
  send,
  setPower,
  setSpeed,
  setFunction,
  sendOutput,
  getConnectionId
}

export default dccApi;
