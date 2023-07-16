import layoutApi from './layoutApi.ts';
import actionApi from './actionApi.ts';

let layoutId = localStorage?.getItem('layoutId');
// TO DO: implement tanStack query

const selectLayout = async (layoutId: string) => {
  console.log('selectLayout', layoutId);
  // localStorage.setItem('layoutId', layoutId);
}

const connect = async (layoutId: string) => {
  console.log('API.connect', layoutId);
  if (layoutId) {
    selectLayout(layoutId);
    await layoutApi.connect(layoutId);
    await actionApi.connect('ws://localhost:8080');
  }
}

const getLayoutId = () => layoutId;

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
  getLayoutId
}

export default api;
