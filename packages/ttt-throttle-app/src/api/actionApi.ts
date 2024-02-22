import { useConnectionStore } from '../store/connectionStore.jsx';
import actions from '../store/actions.tsx';
import { useMQTT } from 'mqtt-vue-hook'

const mqttHook = useMQTT()
const mqttPort = 5005;

let ws:WebSocket;
let connectionId:string;
let queue = [];

const defaultProtocol = 'ws';
const defaultPort = 8080;

async function processQueeue() {
  console.log('[ACTION API] processQueeue', queue);
  queue.map(async ({ action, payload }) => {
    await putWS(action, payload);
  });
  queue = [];
}

async function onOpen() {
  console.log('[ACTION API] onOpen');
  const connStore = useConnectionStore();
  await connStore.setConnection(connectionId, { connected: true });
  processQueeue();
}

function onError(event:any) {
  console.log('[ACTION API] Websocket error', event);
}

async function connectSerial(serial) {
  if (serial) {
    await putWS('serialConnect', { serial });
  }
}

async function parseMessage(topic, message) {
  try {
    console.log('[DCC API] parseMessage', topic, message);
    const { action, payload } = JSON.parse(message);
    const connStore = useConnectionStore();
    console.log('[DCC API] parseMessage', action, payload);
    switch (action) {
      case 'turnouts':
        console.log('turnouts', payload);
        actions.reportTurnout({ [payload.turnoutId]: { state: payload.state } });
        break;
      case 'effects':
        console.log('effects', payload);
        break;
      case 'connected':
        console.log('[ACTION API] setConnection', payload.connectionId, action, payload);
        await connStore.setConnection(payload.connectionId, { connected: true });
        break;
      case 'socketConnected':
        console.log('[ACTION API] socketConnected', action, payload);
        // connectSerial(payload.serial);
        break;
      case 'ports':
        await connStore.setConnection(connectionId, { ports: payload });
        break;
      default:
        console.log('Unknown action', action, payload);
    }
  } catch { 
    console.warn('Message not in JSON format.', event.data); 
  }
}

async function onMessage(event:any) {
  try {
    const { action, payload } = JSON.parse(event.data);
    const connStore = useConnectionStore();
    console.log('[ACTION API] onMessage', action, payload);
    switch (action) {
      case 'turnouts':
        console.log('turnouts', payload);
        actions.reportTurnout({ [payload.turnoutId]: { state: payload.state } });
        break;
      case 'effects':
        console.log('effects', payload);
        break;
      case 'connected':
        console.log('[ACTION API] setConnection', payload.connectionId, action, payload);
        await connStore.setConnection(payload.connectionId, { connected: true });
        break;
      case 'socketConnected':
        console.log('[ACTION API] socketConnected', action, payload);
        // connectSerial(payload.serial);
        break;
      case 'ports':
        await connStore.setConnection(connectionId, { ports: payload });
        break;
      default:
        console.log('Unknown action', action, payload);
    }
  } catch (err) { 
    console.error(err); 
  }
}

async function connect(host, iface) {
  // console.log('[ACTION API] connect', host, iface?.id);
  // connectionId = iface?.id;
  // const connStore = useConnectionStore();
  // await connStore.setConnection(connectionId, { connected: false });
  // ws = new WebSocket(`${defaultProtocol}://${host}:${defaultPort}`);
  // ws.onerror = onError;
  // ws.addEventListener('open', onOpen);   
  // ws.addEventListener('message',  onMessage);


  mqttHook.subscribe(['DCCEX.js'])

  mqttHook.registerEvent(
    'DCCEX.js',
    (topic: string, message: string) => {
        parseMessage(topic, message.toString())
        console.log({
            title: topic,
            message: message.toString(),
            type: 'info',
        })
    },
    'string_key',
  )
  mqttHook.registerEvent(
      'on-connect', // mqtt status: on-connect, on-reconnect, on-disconnect, on-connect-fail
      (topic: string, message: string) => {
          console.log('mqtt connected')
      },
      'string_key',
  )
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
    console.log('[ACTION API] putWS', { action, payload }, ws);
    ws.send(JSON.stringify({ action, payload }));
  } catch (err) {
    queue.push({ action, payload });
    console.error('[ACTION API] api.put', err)
    throw new Error('Unable to update', err, action, payload);
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
