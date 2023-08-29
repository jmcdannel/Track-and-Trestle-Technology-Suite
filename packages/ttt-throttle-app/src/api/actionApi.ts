import { useConnectionStore } from '../store/connectionStore.jsx';
import actions from '../store/actions.tsx';

let ws:WebSocket;
let connectionId:string;

const defaultProtocol = 'ws';
const defaultPort = 8080;

async function onOpen() {
  console.log('[ACTION API] onOpen');
}

function onError(event:any) {
  console.log('[ACTION API] Websocket error', event);
}

async function onMessage(event:any) {
  try {
    const { action, payload } = JSON.parse(event.data);
    console.log('[ACTION API] onMessage', action, payload);
    switch (action) {
      case 'turnouts':
        console.log('turnouts', payload);
        actions.reportTurnout({ [payload.turnoutId]: { state: payload.state } });
        break;
      case 'effects':
        console.log('effects', payload);
        break;
      case 'socketConnected':
        const connStore = useConnectionStore();
        await connStore.setConnection(connectionId, { connected: true });
        break;
      default:
        console.log('Unknown action', action);
    }
  } catch (err) { 
    console.error(err); 
  }
}

async function connect(host, iface) {
  console.log('[ACTION API] connect', host, iface?.id);
  connectionId = iface?.id;
  const connStore = useConnectionStore();
  await connStore.setConnection(connectionId, { connected: false });
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

async function putWS(action, payload) {
  try {
    console.log('[ACTION API] putWS', { action, payload });
    ws.send(JSON.stringify({ action, payload }));
  } catch (err) {
    console.error('[ACTION API] api.put', err)
    throw new Error('Unable to update', err, type, data);
  }
}

export const api = {
  connect,
  disconnect,
  get: getWS,
  put: putWS,
  turnouts: {
    put: (...args)  => putWS('turnouts', ...args)
  },
  effects: {
    put: (...args) => putWS('effects', ...args)
  },
  ports: {
    get: (...args) => getWS('ports', ...args)
  }
}

export default api;
