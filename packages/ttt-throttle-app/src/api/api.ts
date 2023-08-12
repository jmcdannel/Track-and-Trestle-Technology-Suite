// import { store } from '../store/store.tsx';
import { useConfigStore } from '../store/configStore.jsx';
import dccApi from './dccApi.ts';
import actionApi from './actionApi.ts';
import layoutApi from './layoutApi.ts';
import favoritesApi from './favoritesApi.ts';
import config from './config.ts';

async function connect() {
  try {
    const host = await config.host.get();
    const layoutId = await config.layoutId.get();
    const store = useConfigStore();
    console.log('API.connect', host, layoutId, store);
    if (!host) throw new Error('No host specified');
    // if (!store?.connections) throw new Error('No store connections object');
    const connected = host
      ? await layoutApi.connect(host, layoutId)
      : false;
    console.log('connected', connected);
    if (connected) {
      await store.setConnection('layoutApi',   { connected, host });
      await store.setLayoutApi({ connected, host });
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
      };
    });
  } catch (e) {
    throw e;
  }
}

// async function connect(layoutId: string) {
//   console.log('API.connect', layoutId);
//   if (layoutId) {
//     selectLayout(layoutId);
//     await layoutApi.connect(layoutId);
//     await actionApi.connect('ws://joshs-mac-mini.local:8080');
//   }
// }

async function disconnect() {
  const layoutId = await config.layoutId.get();
  console.log('API.disconnect', layoutId);
  if (layoutId) {
    clearLoco();
    clearLayout();
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
