
import { store } from '../store/store.tsx';
import layoutApi from './layoutApi.ts';
import dccApi from './dccApi.ts';

const lsPrefix = '@ttt';

export const SELECTED_LOCO_ID = `${lsPrefix}/selectedLocoId`;
export const LAYOUT_ID = `${lsPrefix}/layoutId`;
export const DCC_CONNECTION = `${lsPrefix}/dccConnection`;
export const LAYOUT_API_CONNECTION = `${lsPrefix}/layoutApiConnection`;
export const LAYOUT_HOST = `${lsPrefix}/layoutHost`;

let host = localStorage?.getItem(LAYOUT_HOST);
let layoutId = localStorage?.getItem(LAYOUT_ID);
let selectedLocoId = localStorage?.getItem(SELECTED_LOCO_ID);
// TO DO: implement tanStack query



async function setConfig(key: string, val: string) {
  try {
    console.log('setConfig', key, val);
    localStorage.setItem(`${lsPrefix}/${key}`, val);
  } catch (e) {
    console.error('setConfig', e);
  }
}

async function getConfig(key: string) {
  try {
    return localStorage.getItem(`${lsPrefix}/${key}`);
  } catch (e) {
    console.error('getConfig', e);
  }
} 

async function clearConfig(key: string) {
  try {
    localStorage.removeItem(`${lsPrefix}/${key}`);
  } catch (e) {
    console.error('clearConfig', e);
  }
} 

async function selectLayout(newLayoutId: string) {
  try {
    console.log('selectLayout', newLayoutId);
    localStorage.setItem(LAYOUT_ID, newLayoutId);
    // const selected = await api.layouts.get(newLayoutId);
    store.layoutId = newLayoutId;
    return newLayoutId;
  } catch (e) {
    console.error('selectLayout', e);
  }
}

async function clearLayout() {
  localStorage.removeItem(LAYOUT_ID);
} 

async function selectLoco(address: number) {
  try {
    console.log('selectLoco', address);
    localStorage.setItem(SELECTED_LOCO_ID, address.toString());
    return address;
  } catch (e) {
    console.error('selectLoco', e);
  }
}

async function clearLoco() {
  localStorage.removeItem(SELECTED_LOCO_ID);
  selectedLocoId = null;
} 

async function setHost(uri:string) {
  try {
    console.log('setLayoutApiHost', uri);
    localStorage.setItem(LAYOUT_HOST, `${uri}`);
    return uri
  } catch (e) {
    console.error('selectLoco', e);
  }
}

async function clearHost() {
  localStorage.removeItem(LAYOUT_HOST);
} 

async function getHost() {
  return localStorage.getItem(LAYOUT_HOST);
} 

const getLayoutId = () => layoutId;

const getSelectedLocoId = () => selectedLocoId;

// const getConnections = async () => {
//   const defaultConnections = {
//     layoutApi: {
//       connected: false,
//       uri: null
//     }
//   };
//   try {
//     const layoutApiStatus = host
//       ? await layoutApi.connect(host)
//       : false;
//     // (layoutApiStatus && layoutId) && await layoutApi.layouts.get(layoutId);
//     const ifaceConnections = (layoutApiStatus && layoutId)
//       ? await getInterfaceConnections(host)
//       : null;
//     console.log('ifaceConnections', ifaceConnections);

//     return {
//       ...defaultConnections,
//       ...ifaceConnections,
//       layoutApi: {
//         connected: layoutApiStatus,
//         uri: host
//       }
//     }
//   } catch (e) {
//     console.error('getConnections', e);
//   }
// }

// const getInterfaceConnections = async (host) => {
//   const ifaceConnections = {};

//   const layout = await layoutApi.layouts.get(layoutId);
//   console.log('interfaces', layout?.interfaces);
//   layout?.interfaces.map(async iface => {
//     switch (iface.type) {
//       case 'dcc-js-api':
//         const result = await dccApi.connect(host, iface);
//         ifaceConnections[iface.id] = {
//           connected: !!result
//         };
//         console.log('iface', iface, result, ifaceConnections);
//         break;
//       };
//   })
//   //  dccApi.connect();

//   return ifaceConnections;
// }

export const config = {
  set: setConfig,
  get: getConfig,
  clear: clearConfig,
  host: { 
    set: setHost,
    get: getHost,
    clear: clearHost
  },
  layoutId: { 
    set: selectLayout,
    get: getLayoutId,
    clear: clearLayout
  },
  loco: {
    set: selectLoco,
    get: getSelectedLocoId,
    clear: clearLoco
  },
  // TODO: deprecate:
  getLayoutId,
  getSelectedLocoId,
  // getConnections,
  selectLoco,
  selectLayout,
  setHost,
  getHost,
  clearLayout,
  clearLoco,
  cledarHost: clearHost,

}

export default config;