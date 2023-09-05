// import { useConnectionStore } from '../store/connectionStore.jsx';
let wsDCC;
let connectionId;
let serial;
let isConnected = false;
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
  console.log('[DCC API] Websocket open');
  isConnected = true;
  let connStore; //useConnectionStore();
  // await connStore.setConnection(connectionId, { api: true });
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
    // const connStore = useConnectionStore();
    console.log('[DCC API] onMessage', action, payload);
    switch (action) {
      case 'listPorts':
        // await connStore.setConnection(connectionId, { ports: payload });
        break;
      case 'socketConnected':
        connectSerial();
        // await connStore.setConnection(connectionId, { connected: true });
        break;
      case 'connected':
        console.log('[DCC API] onMessage.connected', serial);
        // await connStore.setConnection(connectionId, { connected: true });
        break;
    }
  } catch (err) { 
    console.error('[DCC API] onMessage error', err); 
  }
}

async function connect(host, iface, _serial) {
  try {
    connectionId = iface?.id;
    serial = _serial;
    console.log('[DCC API] connect', host, iface?.id, connectionId, serial);
    wsDCC = new WebSocket(`${defaultProtocol}://${host}:${defaultPort}`);
    wsDCC.onerror = onError;
    wsDCC.addEventListener('open', onOpen);   
    wsDCC.addEventListener('message',  onMessage);
  } catch (err) {
    console.error('[DCC API] connect', err);
    throw new Error('Unable to connect', err);
  }
}

async function setPower(payload) {
  try {   
    console.log('[DCC API].setPower', payload);
    send('power', payload ? 1 : 0);
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

async function setSpeed(address, speed) {
  try {   
    send('throttle', { address, speed });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

async function setFunction(address, func) {
  try {   
    send({
      action: 'function', payload: { address, func }
    });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

async function send(action, payload) {
  try { 
    if (wsDCC && isConnected) {  
      sendRaw(JSON.stringify({ action, payload  }));
    } else {
      queue.push({ action, payload });
      // throw new Error('Not connected', connectionId);
    }
  } catch (err) {
    console.error('[DCC API].send', err, action, payload);
  }
}

async function sendRaw(data) {
  try { 
    wsDCC.send(data);
  } catch (err) {
    console.error('[DCC API].sendRaw', err, data);
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
  getConnectionId,
  isConnected
}

export default dccApi;
