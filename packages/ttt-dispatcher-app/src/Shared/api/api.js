import actionApi from './actionApi';
import layoutApi from './layoutApi';
import config from './config'; // TODO: replace with configStore

// let client // mqtt client
// // let broker = 'mqtt://tamarackjunctionmbp.local';
// let broker = 'mqtt://joshs-mac-mini.local';
// const mqttPort = 5005;

// async function mqttConnect(host = broker, port = mqttPort) {
//   console.log('mqttConnect', host, port)
//   client = mqtt.connect(host, { port }); // create a client
//   client.on('connect', function () {
//     console.log('mqtt connected')
//     // Subscribe to a topic
//     client.subscribe('ttt-dispatcher', function (err) {
//       if (!err) {
//         // Publish a message to a topic
//         client.publish('ttt-dispatcher', 'Hello from dispatcher app')
//       }
//     })
//   })
// }

async function connect(_dispatch, host, layoutId) {
  try {
    console.log('[api] connect', host, layoutId);
    if (!host) throw new Error('No host specified');
    const connected = host
      ? await layoutApi.connect(_dispatch, host, layoutId)
      : false;
    console.log('[api] connected', connected);
    // await mqttConnect();
    return connected;
  } catch (e) {
    throw e;
  }
}

async function handleTurnout(turnout) {
  console.log('API.handleTurnout', turnout);
  switch(turnout?.config?.interface) {
    case 'dcc-js-api':
      // dccApi.setTurnout(turnout.config.dccExId, turnout.state);
      break;
    case 'mqtt':
      const action = {
        servo: turnout.config.servo,
        angle: turnout.state ? turnout.config.divergent : turnout.config.straight
      }
      // client.publish('ttt', JSON.stringify(action));
      break;
    case 'betatrack-io':
    case 'tamarack-junction-station-south-io':
    case 'serial':
    case 'action-api':
      actionApi.turnouts.put(turnout);
      break;
    default:
      console.warn('Unknown interface type', turnout?.config?.interface, turnout);
      break;
  }
}

async function handleIALed(effect) {
  try {
    const action = {
      ...effect.config, 
      command: effect.state ? effect.config.command : 'off'
    }
    // client.publish('ttt-ialed', JSON.stringify(action));
  } catch (err) {
    console.error('[IALED ERROR]', err?.message, JSON.stringify(effect));
  }
}

async function handleEffect(effect) {
  try {
    console.log('API.handleEffect', effect);

    if (effect?.config?.interface === 'dcc-js-api') {
      // dccApi.setOutput(effect.config.pin, effect.state);
    } else if (effect?.type === 'ialed') {
      await handleIALed(effect);
    } else {
      actionApi.effects.put(effect);
    }

  } catch (error) {
    console.error('API.handleEffect', error, effect);
  }

}

async function handleAction(effect, action) {
  console.log('API.handleAction', action);
  switch(action.interface) {
    case 'dcc-js-api':
      break;
    case 'betatrack-io':
    case 'action-api':
      actionApi.effects.put(effect);
      break;
    default:
      console.warn('Unknown interface type', action);
      break;
  }
}

async function disconnect() {
  if (layoutId) {
    config.loco.clear();
    config.layoutId.clear();
    await actionApi.disconnect();
  }
}

export const api = {
  actionApi,
  layouts: {
    get: layoutApi.layouts.get
  },
  locos: {
    get: layoutApi.locos.get
  },
  routes: {
    get: layoutApi.locos.get
  },
  effects: {
    put: handleEffect
  },
  turnouts: {
    put: handleTurnout
  },
  connect,
  disconnect,
  config
}

export default api;
