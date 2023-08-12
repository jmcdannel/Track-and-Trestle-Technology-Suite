import { store } from '../store/store.jsx';
let wsDCC;
let connectionId;

const defaultProtocol = 'ws';
const defaultPort = 8081;

function onOpen() {
  console.log('[DCC API] onOpen', store?.connections, connectionId, store?.connections?.[connectionId]);
  if (store?.connections?.[connectionId]) {
    store.connections[connectionId].api = true;
    // store.connections[connectionId].connected = true;
  }
}

function onError(event) {
  console.log('[DCC API] Websocket error', event);
}

function onMessage(event) {
  try {
    const { action, payload } = JSON.parse(event.data);
    console.log('[DCC API] onMessage', action, payload, connectionId, store.connections[connectionId]);
    switch (action) {
      case 'listPorts':
        store.connections[connectionId].ports = payload;
        break;
      case 'connected':
        store.connections[connectionId].connected = true;
        break;
    }
  } catch { 
    console.warn('Message not in JSON format.', event.data); 
  }
}

async function connect(host, iface) {
  console.log('[DCC API] connect', host, iface?.id);
  connectionId = iface?.id;
  wsDCC = new WebSocket(`${defaultProtocol}://${host}:${defaultPort}`);
  wsDCC.onerror = onError;
  wsDCC.addEventListener('open', onOpen);   
  wsDCC.addEventListener('message',  onMessage);
}

async function setPower(payload) {
  try {   
    send('power', payload);
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
    wsDCC.send(JSON.stringify({ action, payload  }));
  } catch (err) {
    console.error('[DCC API].send', err);
    throw new Error('Unable to send', err, action, payload);
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
  getConnectionId
}

export default dccApi;
