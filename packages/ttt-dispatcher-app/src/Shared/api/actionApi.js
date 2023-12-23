
// import actions from '../store/actions.tsx';

let ws;
let isConnected = false;

const defaultProtocol = 'ws';
const defaultPort = 8080;

async function onOpen() {
  isConnected = true;
  console.log('[ACTION API] Websocket, onOpen');
}

function onError(event) {
  console.log('[ACTION API] Websocket error', event);
}

async function connectDevice(port) {
  try {
    console.log('[ACTION API] connectDevice', port);
    if (port) {
      await send('serialConnect', { serial: port });
      return true;
    }
  } catch (err) {
    console.error('[ACTION API] connectDevice', err);
    throw new Error('Unable to connect', err);
  }
}

async function connect(host, handleMessage) {
  try {
    console.log('[ACTION API] connect', host);
    ws = new WebSocket(`${defaultProtocol}://${host}:${defaultPort}`);
    ws.onerror = onError;
    ws.addEventListener('open', onOpen);   
    ws.addEventListener('message',  handleMessage);
    return true;
  } catch (err) {
    console.error('[ACTION API] connect', err);
    throw new Error('Unable to connect', err);
  }
}

async function disconnect() {
  ws.close();
}

async function send(action, payload) {
  try { 
    if (ws && isConnected) {  
      sendRaw(JSON.stringify({ action, payload  }));
    } else {
      throw new Error('Not connected');
    }
  } catch (err) {
    console.error('[ACTION API].send', err, action, payload);
  }
}

async function sendRaw(data) {
  try { 
    ws.send(data);
  } catch (err) {
    console.error('[ACTION API].sendRaw', err, data);
  }
}

export const api = {
  connect,
  connectDevice,
  disconnect,
  turnouts: {
    put: (...args)  => send('turnouts', ...args)
  },
  effects: {
    put: (...args) => send('effects', ...args)
  },
  fetchPorts: (...args) => send('ports', ...args)
}

export default api;
