import axios from 'axios';

let layoutId: string;

const instance = axios.create({
  baseURL: 'http://joshs-mac-mini.local:5001/api'
});

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

async function connect(_layoutId: string) {
  layoutId = _layoutId;
  console.log('Layout api connect', layoutId);
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