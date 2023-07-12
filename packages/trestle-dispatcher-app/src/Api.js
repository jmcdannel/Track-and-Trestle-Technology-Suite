import { getAppConfig } from './config/config';
import log from './Shared/utils/logger';

const appConfig = getAppConfig();
const { layoutId } = appConfig;

let ws;
let dispatch;

const locoDefaults = {
  isAcquired: false,
  cruiseControl: false,
  autoStop: true,
  maxSpeed: 100,
  speed: 0,
  forward: true,
  lastAcquired: null,
  lastUpdated: null
};

function onOpen() {
  log.start('onOpen', layoutId);
  // ws.send(JSON.stringify({
  //   action: 'initialize', payload: { layoutId }
  // }));
}

function onError(event) {
  log.error('Websocket error');
}

function onMessage(event) {
  try {
    reduceMessage(JSON.parse(event.data));
  } catch { 
    log.warn('Message not in JSON format.', event.data); 
  }
}

const reduceMessage = async ({ action, payload}) => {
  log.debug('reduceMessage', action);
  switch(action) {
    case 'initialize':
      await dispatch({ type: 'INIT_STATE', payload });
      log.start('WS Initialized');
      initializeModules(payload);
      break;
    case 'turnouts':
      await dispatch({ type: 'UPDATE_TURNOUTS', payload });
      break;
    case 'effects':
      await dispatch({ type: 'UPDATE_EFFECTS', payload });
      break;
    case 'locos':
      await dispatch({ type: 'UPDATE_LOCOS', payload });
      break;
    case 'routes':
      await dispatch({ type: 'UPDATE_ROUTES', payload });
      break;
    case 'ports':
      await dispatch({ type: 'UPDATE_PORTS', payload });
      break;
    case 'message':
      log.debug(payload);
      break;
    default:
      log.warn('default message reducer', action);
      break;
  };
}

async function initializeWS() {
  // dispatch = _dispatch;
  log.start('initializeWS', appConfig.api);
  ws = new WebSocket(appConfig.api);
  ws.onerror = onError;
  ws.addEventListener('open', onOpen);   
  ws.addEventListener('message',  onMessage);
  return true;
}

const initializeModules = layoutConfig => {
  const getModules = layoutConfig.modules.reduce((reqs, module) => api[module] && api[module].get ? [...reqs, module] : [...reqs], []);
  getModules.map(req => api[req].get());
}

async function initialize(_dispatch) {
  dispatch = _dispatch;
  // const payload = await api.get();
  // log.ready('api.initialize', payload);
  // await dispatch({ type: 'INIT_STATE', payload });
  // initializeModules(payload);
  // return true;



  const payload = await api.get();
  const getModules = payload.modules.reduce((reqs, module) => api[module] && api[module].get ? [...reqs, module] : [...reqs], []);
  log.debug('getModules', getModules);
  const results = await Promise.all(
    getModules.map(req => api[req].get()
      .then(resp => resp?.[0]?.[req] ? resp?.[0]?.[req] : resp?.[0])));
  log.debug('results', results);
  const initialState = getModules.reduce((state, module, index) => ({ 
    ...state, 
    [module]: results[index] 
  }), { layout: payload });
  log.debug('initialState', initialState);
  await dispatch({ type: 'INIT_STATE', payload: initialState });
  // return initialState;
  // return true;
}

async function getWS(type = null, Id = null) {
  // try {    
  //   ws.send(JSON.stringify({
  //     action: type || 'initialize', payload: { Id }
  //   }));
  // } catch (err) {
  //   log.error('api.get', err);
  //   throw new Error('Unable to read', err, type, `Id=${Id}`);
  // }
}

async function putWS(type, data, idField) {
  try {
    const Id = idField ? data[idField] : data[`${type}Id`];
    log.debug('putWS', {
      action: type, payload: { Id, data }
    });
    ws.send(JSON.stringify({
      action: type, payload: { Id, data }
    }));
  } catch (err) {
    log.error('api.put', err)
    throw new Error('Unable to update', err, type, data);
  }
}

async function get(type = null, Id = null) {
  try {
    const baseUri = `${appConfig.layoutApi}/${appConfig.layoutId}`;
    const uri = type !== null
      ? Id !== null
        ? `${baseUri}/${type}/${Id}`
        : `${baseUri}/${type}`
      : `${appConfig.layoutApi}/layouts/${appConfig.layoutId}`;
    log.debug('get', uri);
    const response = uri ? await fetch(uri) : null;
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Unable to read', type, `Id=${Id}`);
  }
}


function initializeLocos(locos) {
  return locos.map(loco => ({ ...locoDefaults, ...loco }));
}

export const apiStates = {
  idle: 'idle',
  pending: 'pending',
  done: 'done',
  error: 'error'
}

export const api = {
  initialize,
  initializeWS,
  get,
  put: putWS,
  turnouts: {
    get: args => get('turnouts', args),
    put: args => putWS('turnouts', args, 'turnoutId')
  },
  effects: {
    get: args => get('effects', args),
    put: (...args) => putWS('effects', ...args)
  },
  locos: {
    get: args => get('locos', args, 'address'),
    put: args => putWS('locos', args, 'address'),
    initialize: initializeLocos
  },
  sensors: {
    get: args => get('sensors', args)
  },
  routes: {
    get: args => get('routes', args)
  },
  ports: {
    get: args => get('ports', args)
  },
  interfaces: {
    put: args => putWS('interfaces', args, 'id'),
  }
}

export default api;
