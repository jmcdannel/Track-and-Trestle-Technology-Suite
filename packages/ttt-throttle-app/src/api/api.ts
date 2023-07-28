import { store } from '../store/store.tsx';
import layoutApi from './layoutApi.ts';
import actionApi from './actionApi.ts';
import favoritesApi from './favoritesApi.ts';

const SELECTED_LOCO_ID = '@ttt/selectedLocoId';
const LAYOUT_ID = '@ttt/layoutId';

let layoutId = localStorage?.getItem(LAYOUT_ID);
let selectedLocoId = localStorage?.getItem(SELECTED_LOCO_ID);
// TO DO: implement tanStack query

async function selectLayout(newLayoutId: string) {
  try {
    console.log('selectLayout', newLayoutId);
    localStorage.setItem(LAYOUT_ID, newLayoutId);
    const selected = await api.layouts.get(newLayoutId);
    store.layoutId = newLayoutId;
    return selected;
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
    const selected = await api.locos.get(address);
    return selected;
  } catch (e) {
    console.error('selectLoco', e);
  }
}

async function clearLoco() {
  localStorage.removeItem(SELECTED_LOCO_ID);
  selectedLocoId = null;
} 

async function connect(layoutId: string) {
  console.log('API.connect', layoutId);
  if (layoutId) {
    selectLayout(layoutId);
    await layoutApi.connect(layoutId);
    await actionApi.connect('ws://joshs-mac-mini.local:8080');
  }
}

async function disconnect() {
  console.log('API.disconnect', layoutId);
  if (layoutId) {
    clearLoco();
    clearLayout();
    await actionApi.disconnect();
  }
}

const getLayoutId = () => layoutId;

const getSelectedLocoId = () => selectedLocoId;

layoutId && connect(layoutId);

export const api = {
  layouts: {
    get: layoutApi.layouts.get
  },
  locos: {
    get: layoutApi.locos.get
  },
  effects: {
    put: actionApi.effects.put
  },
  turnouts: {
    put: actionApi.turnouts.put
  },
  connect,
  disconnect,
  getLayoutId,
  getSelectedLocoId,
  selectLoco,
  selectLayout,
  clearLayout,
  clearLoco,
  favorites: favoritesApi
}

export default api;
