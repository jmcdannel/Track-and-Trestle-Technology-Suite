
// import { useConfigStore } from '../store/configStore.jsx';

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



async function setConfig(key, val) {
  try {
    console.log('setConfig', key, val);
    localStorage.setItem(`${lsPrefix}/${key}`, val);
  } catch (e) {
    console.error('setConfig', e);
  }
}

async function getConfig(key) {
  try {
    return localStorage.getItem(`${lsPrefix}/${key}`);
  } catch (e) {
    console.error('getConfig', e);
  }
} 

async function clearConfig(key) {
  try {
    localStorage.removeItem(`${lsPrefix}/${key}`);
  } catch (e) {
    console.error('clearConfig', e);
  }
} 

async function selectLayout(newLayoutId) {
  try {
    // const store = useConfigStore();
    console.log('selectLayout', newLayoutId);
    localStorage.setItem(LAYOUT_ID, newLayoutId);
    // const selected = await api.layouts.get(newLayoutId);
    // store.setLayoutId(newLayoutId);
    return newLayoutId;
  } catch (e) {
    console.error('selectLayout', e);
  }
}

async function clearLayout() {
  localStorage.removeItem(LAYOUT_ID);
} 

async function selectLoco(address) {
  try {
    const store = useConfigStore();
    console.log('selectLoco', address);
    localStorage.setItem(SELECTED_LOCO_ID, address.toString());
    store.setLocoId(address);
    return address;
  } catch (e) {
    console.error('selectLoco', e);
  }
}

async function clearLoco() {
  localStorage.removeItem(SELECTED_LOCO_ID);
  selectedLocoId = null;
} 

async function setHost(uri) {
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