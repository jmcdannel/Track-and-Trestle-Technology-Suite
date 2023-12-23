import axios from 'axios';
import log from '../utils/logger';

let layoutId;
let baseUrl;
let dispatch;

const instance = axios.create();

async function get(type, Id = null) {
  try {
    const uri = Id !== null
        ? `/${layoutId}/${type}/${Id}`
        : `/${layoutId}/${type}`;
    // console.log('[layoutApi] get', uri);
    const response = uri ? await instance.get(uri) : null;
    return Id 
      ? response.data 
      : response.data?.[0]?.[type]
        ? response.data?.[0]?.[type]
        : response.data?.[0];
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to read ${type}, Id=${Id}`);
  }
}

async function getLayouts(Id = null) {
  try {
    const uri = Id
        ? `/layouts/${Id}`
        : `/layouts`;
    const { data } = await instance.get(uri);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to read layouts, Id=${Id}`);
  }
}

async function setLayout(_layoutId) {
  layoutId = _layoutId;
}

async function initialize() {
  const payload = await getLayouts(layoutId);
  const getModules = payload.modules.reduce((reqs, module) => api[module] && api[module].get ? [...reqs, module] : [...reqs], []);
  const results = await Promise.all( getModules.map(req => api[req].get()) );
  const initialState = getModules.reduce((state, module, index) => ({ 
    ...state, 
    [module]: results[index] 
  }), { layout: payload });
  await dispatch({ type: 'INIT_STATE', payload: initialState });
}

async function connect(_dispatch, host, _layoutId) {
  try {
    console.log('[layoutApi] connect', host, _layoutId);
    dispatch = _dispatch;
    layoutId = _layoutId ? _layoutId : layoutId;
    instance.defaults.baseURL = `http://${host}:5200/api`;
    if (layoutId) {
      await initialize();
    } else {
      const payload = await getLayouts();
    }
    // const apiResponse = await getLayouts(layoutId);
    // console.log('apiResponse',  apiResponse);
    return true;
  }catch (err) {
    console.error(err);
    throw new Error(`Unable to connect to ${host}`);
  }
}

export const api = {
  connect,
  layouts: {
    get: getLayouts
  }, 
  turnouts: {
    get: args => get('turnouts', args),
    put: args => putWS('turnouts', args, 'turnoutId')
  },
  effects: {
    get: args => get('effects', args),
    put: (...args) => putWS('effects', ...args)
  },
  routes: {
    get: args => get('routes', args),
    put: (...args) => putWS('routes', ...args)
  },
  locos: {
    get: async (Id = null) => await get('locos', Id),
    // put: args => putWS('locos', args, 'address'),
    // initialize: initializeLocos
  },
}

export default api;