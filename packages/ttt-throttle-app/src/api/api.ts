import layoutApi from './layoutApi.ts';
import actionApi from './actionApi.ts';

const SELECTED_LOCO_ID = 'selectedLocoId';
const LAYOUT_ID = 'layoutId';

let layoutId = localStorage?.getItem(LAYOUT_ID);
let selectedLocoId = localStorage?.getItem(SELECTED_LOCO_ID);
// TO DO: implement tanStack query

const selectLayout = async (layoutId: string) => {
  try {
    console.log('selectLayout', layoutId);
    localStorage.setItem(LAYOUT_ID, layoutId);
    const selected = await api.layouts.get(layoutId);
    return selected;
  } catch (e) {
    console.error('selectLayout', e);
  }
}

const selectLoco = async (address: number) => {
  try {
    console.log('selectLoco', address);
    localStorage.setItem(SELECTED_LOCO_ID, address.toString());
    const selected = await api.locos.get(address);
    return selected;
  } catch (e) {
    console.error('selectLoco', e);
  }
}

const connect = async (layoutId: string) => {
  console.log('API.connect', layoutId);
  if (layoutId) {
    selectLayout(layoutId);
    await layoutApi.connect(layoutId);
    await actionApi.connect('ws://joshs-mac-mini.local:8080');
  }
}

const getLayoutId = () => layoutId;

const getSelectedLocoId = () => selectedLocoId;

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
  getLayoutId,
  getSelectedLocoId,
  selectLoco,
  selectLayout
}

export default api;
