import axios from 'axios';

let layoutId: string;
let baseUrl: string;

const instance = axios.create();

async function get(type:string, Id = null) {
  try {
    const uri = Id !== null
        ? `/${layoutId}/${type}/${Id}`
        : `/${layoutId}/${type}`;
    console.log('get', uri);
    const response:any = uri ? await instance.get(uri) : null;
    console.log('response', response);
    return Id ? response.data : response.data?.[0]?.locos;
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to read ${type}, Id=${Id}`);
  }
}

async function getLayouts(Id:string | undefined) {
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

async function setLayout(_layoutId: string) {
  layoutId = _layoutId;
  console.log('setLayout', layoutId);
}

async function connect(uri: string, _layoutId?:string) {
  try {
    console.log('Layout api connect - uri', uri, _layoutId );  
    layoutId = _layoutId ? _layoutId : layoutId;
    instance.defaults.baseURL = `http://${uri}:5200/api`;
    const apiResponse = await instance.get('/');
    console.log('apiResponse',  apiResponse, !!apiResponse?.data);
    return !!apiResponse?.data;
  }catch (err) {
    console.error(err);
    throw new Error(`Unable to connect to ${uri}`);
  }
}

export const api = {
  connect,
  layouts: {
    get: getLayouts
  }, 
  // turnouts: {
  //   get: args => get('turnouts', args),
  //   put: args => putWS('turnouts', args, 'turnoutId')
  // },
  // effects: {
  //   get: args => get('effects', args),
  //   put: (...args) => putWS('effects', ...args)
  // },
  locos: {
    get: async (Id:any = null) => await get('locos', Id),
    // put: args => putWS('locos', args, 'address'),
    // initialize: initializeLocos
  },
}

export default api;