import { useConnectionStore } from '../store/connectionStore.jsx';
import dccApi from './dccApi.ts';
import actionApi from './actionApi.ts';
import layoutApi from './layoutApi.ts';
import favoritesApi from './favoritesApi.ts';
import config from './config.ts'; // TODO: replace with configStore

async function connect() {
  try {
    const host = await config.host.get();
    const layoutId = await config.layoutId.get();
    const connStore = useConnectionStore();
    console.log('API.connect', host, layoutId);
    if (!host) throw new Error('No host specified');
    const connected = host
      ? await layoutApi.connect(host, layoutId)
      : false;
    console.log('connected', connected);
    if (connected) {
      await connStore.setConnection('layoutApi', { connected, host });
    }
    (connected && layoutId) 
      && await connectInterfaces(host, layoutId);
  } catch (e) {
    throw e;
  }
}

async function connectInterfaces(host, layoutId) {

  try {
    console.log('connectInterfaces', layoutId);
    // await dccApi.connect(host);
    const layout = await layoutApi.layouts.get(layoutId);
    console.log('interfaces', layout, layout?.interfaces);
    layout?.interfaces.map(async iface => {
    switch (iface.type) {
      case 'dcc-js-api':
        const dccSerial = await config.get(iface.id);
        await dccApi.connect(host, iface, dccSerial);

        break;
      case 'action-api':
        await actionApi.connect(host, iface);
        break;
      };
    });
  } catch (e) {
    throw e;
  }
}

async function disconnect() {
  const layoutId = await config.layoutId.get();
  console.log('API.disconnect', layoutId);
  if (layoutId) {
    config.loco.clear();
    config.layoutId.clear();
    await actionApi.disconnect();
  }
}

export const api = {
  dcc: dccApi,
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
  config,
  favorites: favoritesApi
}

export default api;
