// import { useConnectionStore } from '../store/connectionStore.jsx';
import dccApi from './dccApi';
import actionApi from './actionApi';
import layoutApi from './layoutApi';
// import favoritesApi from './favoritesApi';
import config from './config'; // TODO: replace with configStore

let dispatch;

async function connect(_dispatch) {
  try {
    dispatch = _dispatch;
    const host = await config.host.get();
    const layoutId = await config.layoutId.get();
    // const connStore = useConnectionStore();
    console.log('[api] connect', host, layoutId);
    if (!host) throw new Error('No host specified');
    const connected = host
      ? await layoutApi.connect(dispatch, host, layoutId)
      : false;
    console.log('[api] connected', connected);
    if (connected) {
      // await connStore.setConnection('layoutApi', { connected, host });
      await dispatch({ type: 'UPDATE_CONNECTION', payload: { connectionId: 'layoutApi', connected, host } });
    }
    (connected && layoutId) 
      && await connectInterfaces(host, layoutId);
  } catch (e) {
    throw e;
  }
}

async function connectInterfaces(host, layoutId) {

  try {
    console.log('[api] connectInterfaces', layoutId);
    // await dccApi.connect(host);
    const layout = await layoutApi.layouts.get(layoutId);
    console.log('interfaces', layout, layout?.interfaces);
    layout?.interfaces.map(async iface => {
    switch (iface.type) {
      case 'dcc-js-api':
        const dccSerial = await config.get(iface.id);
        await dccApi.connect(dispatch, host, iface, dccSerial);
        break;
      case 'action-api':
        const usbSerial = await config.get(iface.id);
        await actionApi.connect(dispatch, host, iface, usbSerial);
        break;
      case 'serial':
        const serial = await config.get(iface.id);
        console.log('connect serial', serial, iface);
        await actionApi.put('serialConnect', { connectionId: iface.id, serial });
        break;
      default:
        console.warn('Unknown interface type', iface.type, iface);
        break;
      };
    });
  } catch (e) {
    throw e;
  }
}

async function handleTurnout(turnout) {
  console.log('API.handleTurnout', turnout);
  switch(turnout?.config?.interface) {
    case 'dcc-js-api':
      dccApi.setTurnout(turnout.config.dccExId, turnout.state);
      break;
    case 'betatrack-io':
    case 'action-api':
      actionApi.turnouts.put(turnout);
      break;
    default:
      console.warn('Unknown interface type', turnout?.config?.interface, turnout);
      break;
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
  actionApi,
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
    put: handleTurnout
  },
  connect,
  disconnect,
  config,
  // favorites: favoritesApi
}

export default api;
