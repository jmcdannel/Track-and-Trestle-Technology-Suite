
// import actions from '../store/actions.tsx';

let ws;
let connectionId;
let serial;
let isConnected = false;
let queue = [];
let dispatch;

const defaultProtocol = 'ws';
const defaultPort = 8080;

async function processQueeue() {
  console.log('[ACTION API] processQueeue', queue);
  queue.map(async ({ action, payload }) => {
    await send(action, payload);
  });
  queue = [];
}

async function onOpen() {
  isConnected = true;
  console.log('[ACTION API] onOpen');
  await dispatch({ type: 'UPDATE_CONNECTION', payload: { connectionId, connected: true } });
  processQueeue();
}

function onError(event) {
  console.log('[ACTION API] Websocket error', event);
}

async function connectSerial() {
  if (serial) {
    await send('serialConnect', { serial });
  }
}

async function onMessage(event) {
  try {
    const { data, success } = JSON.parse(event.data);
    const { action, payload } = data;
    console.log('[ACTION API] onMessage', data, success, action, payload);
    switch (action) {
      case 'turnouts':
        console.log('turnouts', payload);
        // actions.reportTurnout({ [payload.turnoutId]: { state: payload.state } });
        break;
      case 'effects':
        console.log('effects', payload);
        break;
      case 'connected':
        console.log('[ACTION API] setConnection', payload.connectionId, action, payload);
        await dispatch({ type: 'UPDATE_CONNECTION', payload: { connectionId: payload.connectionId, connected: true } });
        break;
      case 'socketConnected':
        console.log('[ACTION API] socketConnected', action, payload);
        connectSerial();
        break;
      case 'ports':
        console.log('[ACTION API] ports', connectionId, action, payload);
        await dispatch({ type: 'UPDATE_CONNECTION', payload: { connectionId, ports: payload } });
        break;
      default:
        console.log('Unknown action', action, payload);
    }
  } catch (err) { 
    console.error(err); 
  }
}

async function connect(_dispatch, host, iface, _serial) {
  console.log('[ACTION API] connect', host, iface?.id);
  dispatch = _dispatch;
  connectionId = iface?.id;
  serial = _serial;
  await dispatch({ type: 'UPDATE_CONNECTION', payload: { connectionId, connected: false } });
  ws = new WebSocket(`${defaultProtocol}://${host}:${defaultPort}`);
  ws.onerror = onError;
  ws.addEventListener('open', onOpen);   
  ws.addEventListener('message',  onMessage);
}

async function disconnect() {
  ws.close();
}

async function getWS(type ) {
  try {    
    ws.send(JSON.stringify({
      action: type
    }));
  } catch (err) {
    console.error('[ACTION API] api.get', err);
    throw new Error('Unable to read', err, type);
  }
}

async function send(action, payload) {
  try { 
    if (ws && isConnected) {  
      sendRaw(JSON.stringify({ action, payload  }));
    } else {
      queue.push({ action, payload });
      // throw new Error('Not connected', connectionId);
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
  disconnect,
  get: getWS,
  put: send,
  turnouts: {
    put: (...args)  => send('turnouts', ...args)
  },
  effects: {
    put: (...args) => send('effects', ...args)
  },
  ports: {
    get: (...args) => getWS('ports', ...args)
  },
  isConnected
}

export default api;
