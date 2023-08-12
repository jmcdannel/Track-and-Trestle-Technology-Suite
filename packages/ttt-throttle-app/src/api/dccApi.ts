import { useConfigStore } from '../store/configStore.jsx';
let wsDCC;
let connectionId;
let serial;

const defaultProtocol = 'ws';
const defaultPort = 8081;

function onOpen() {
  const store = useConfigStore();
  store.setDCCApi({ api: true });
  // const 
  // console.log('[DCC API] onOpen', store?.connections, connectionId, store?.connections?.[connectionId]);
  // if (store?.connections?.[connectionId]) {
  //   store.connections[connectionId].api = true;
  //   // store.connections[connectionId].connected = true;
  // }
}

async function connectSerial() {
  if (serial) {
    await send('connect', { serial });
  }

}

function onError(event) {
  console.log('[DCC API] Websocket error', event);
}

function onMessage(event) {
  try {
    const { action, payload } = JSON.parse(event.data);
    const store = useConfigStore();
    console.log('[DCC API] onMessage', action, payload);
    switch (action) {
      case 'listPorts':
        store.setDCCApi({ ports: payload });
        // store.connections[connectionId].ports = payload;
        break;
      case 'socketConnected':
        connectSerial();
        break;
      case 'connected':
        console.log('onMessage.connected', serial);
        store.setDCCApi({ connected: true });
        break;
    }
  } catch { 
    console.warn('Message not in JSON format.', event.data); 
  }
}

async function connect(host, iface, _serial) {
  console.log('[DCC API] connect', host, iface?.id);
  connectionId = iface?.id;
  serial = _serial;
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
