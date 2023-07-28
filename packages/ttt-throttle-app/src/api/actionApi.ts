import actions from '../store/actions.tsx';

let ws;

function onOpen() {
  console.log('[API] onOpen');
}

function onError(event) {
  console.log('[API] Websocket error', event);
}

function onMessage(event) {
  try {
    const { success, data } = JSON.parse(event.data);
    console.log('[API] onMessage', success, data, JSON.parse(event.data));
    if (success) {
      const { action, payload } = data;
      switch (action) {
        case 'turnouts':
          console.log('turnouts', payload);
          actions.reportTurnout({ [payload.turnoutId]: { state: payload.state } });
          break;
        case 'effects':
          console.log('effects', payload);
          break;
        case 'ports':
          console.log('ports', payload);
          apiPromises.ports.resolve(payload);
          break;
        default:
          console.log('Unknown action', action);
      }
    }
  } catch (err) { 
    console.error(err); 
  }
}

async function connect(uri) {
  ws = new WebSocket(uri);
  ws.onerror = onError;
  ws.addEventListener('open', onOpen);   
  ws.addEventListener('message',  onMessage);
}

async function disconnect() {
  ws.close();
}

async function getWS(type ) {
  try {    
    if (Object.keys(apiPromises).includes(type)) {
      const promise = new Promise((resolve, reject) => {
        apiPromises[type] = { resolve, reject };
      })
    }
    ws.send(JSON.stringify({
      action: type
    }));
  } catch (err) {
    console.error('api.get', err);
    throw new Error('Unable to read', err, type);
  }
}

async function putWS(action, payload) {
  try {
    console.log('putWS', { action, payload });
    ws.send(JSON.stringify({ action, payload }));
  } catch (err) {
    console.error('api.put', err)
    throw new Error('Unable to update', err, type, data);
  }
}

const apiPromises = {
  turnouts: null,
  effects: null,
  ports: null
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
