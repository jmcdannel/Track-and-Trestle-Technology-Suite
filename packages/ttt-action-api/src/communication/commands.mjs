import axios from 'axios';
// import { getById as getEffectById } from '../modules/effects.mjs';
import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const layoutId = process.env.LAYOUT_ID; // TODO: move to config

const baseUri = `http://127.0.0.1:5001/api/${layoutId}`;

// const tunroutCommand = turnout => {
//   console.log('tunroutCommand', turnout);
//   switch(turnout.config.type) {
//     case 'kato':
//       return {
//         iFaceId: turnout.config.interface,
//         action: 'turnout', 
//         payload: { 
//           turnout: turnout.config.turnoutIdx, 
//           state: turnout.state 
//         }
//       };
//     case 'servo':
//       return {
//         iFaceId: turnout.config.interface,
//         action: 'servo', 
//         payload: { 
//           servo: turnout.config.servo, 
//           value: turnout.state 
//             ? turnout.config.straight 
//             : turnout.config.divergent, 
//           current: !turnout.state 
//             ? turnout.config.straight 
//             : turnout.config.divergent
//         }
//       };
//     default:
//       // no op
//       break;
//   }
// }

const macroCommand = async (effect, action, delay = 0) => {
  console.log('macroCommand', effect, action);
  const uri = `${baseUri}/effects/${action.effectId}`;
  log.log('[COMMANDS] macroCommand.uri', uri);
  const resp = await axios.get(uri);
  const macroEffect = resp?.data
  log.log('[COMMANDS] macroEffect', macroEffect);
  return macroEffect;
  
}

const signalCommand = async effect => {
  const commands = [];

  await Promise.all(['red', 'yellow', 'green'].map(async color => {
    if (effect.config[color]) {
      const uri = `${baseUri}/effects/${effect.config[color]}`;
      log.fav('[COMMANDS] signalCommand.uri', uri);
      const resp = await axios.get(uri);
      log.fav('[COMMANDS] signalCommand.resp', resp?.data);
      const signalEffect = resp?.data;
      log.fav('[COMMANDS] signalEffect', signalEffect);
      signalEffect.state = effect.state === color;
      commands.push(pinCommand(signalEffect));
    }

  }));
  log.fav('[COMMANDS] signalCommand', commands);

  return commands;
  
  
}

const pinCommand = effect => ({ 
  iFaceId: effect?.config?.interface,
  action: 'pin', 
  payload: { 
    pin: effect?.config?.pin,
    state: effect.state
  }
});

const soundCommand = effect => ({ 
  iFaceId: effect?.config?.interface,
  action: 'sound', 
  payload: { 
    file: effect?.config?.file,
    state: effect.state
  }
});

/*
{
    "start": 0,
    "end": 99,
    "command": "color",
    "config": {
      "r": 50,
      "g": 0,
      "b": 200
    }
  }
  */
const ialedCommand = effect => ({ 
  iFaceId: effect?.config?.interface,
  action: 'ialed', 
  payload: { 
    start: effect?.config?.start,
    end: effect?.config?.end,
    command: effect?.config?.command,
    r: effect?.config?.r,
    g: effect?.config?.g,
    b: effect?.config?.b
  }
});

const effectCommand = async (payload) => {
  const uri = `${baseUri}/effects/${payload.effectId}`;
  const resp = await axios.get(uri);
  const effect = {...resp?.data?.effects?.[0], state: payload.state};  
  
  switch(effect.type) {
    case 'light':
    case 'frog':
    case 'relay':
    case 'pin':
      return [pinCommand(effect)];
    case 'ialed':
      return [ialedCommand(effect)];
    case 'sound':
      return [soundCommand(effect)];
    case 'signal':
      const signalCommands = await signalCommand(effect);
      return signalCommands;
    case 'macro':
      const macroCommands = await macroCommand(effect);
      return macroCommands;
    default: 
      // no op
      break;
  }
}

const turnoutCommand = async (payload) => {
  const uri = `${baseUri}/turnouts/${payload.turnoutId}`;
  const resp = await axios.get(uri);
  const turnout = {...resp.data?.turnouts?.[0], state: payload.state};
  switch(turnout.config.type) {
    case 'kato':
      return {
        iFaceId: turnout.config.interface,
        action: 'turnout', 
        payload: { 
          turnout: turnout.config.turnoutIdx, 
          state: turnout.state 
        }
      };
    case 'servo':
      return {
        iFaceId: 'serial', //iFaceId: turnout.config.interface,
        action: 'servo', 
        payload: { 
          servo: turnout.config.servo, 
          value: turnout.state 
            ? turnout.config.straight 
            : turnout.config.divergent, 
          current: !turnout.state 
            ? turnout.config.straight 
            : turnout.config.divergent
        }
      };
    default:
      // no op
      break;
  }
}

export const build = async (msg) => {
  const { action, payload } = msg;
  let commandList = [];
  switch(action) {
    case 'turnouts':
      commandList.push(await turnoutCommand(payload));
      break;
    case 'effects':
      commandList = await effectCommand(payload);
      break;
    default: 
      // no op
      break;
  }
  // log.debug('[COMMANDS] commandList', commandList);
  return commandList;
}

export const send = (commands) => {
  log.start('[COMMANDS] send', commands);
  const coms = [...new Set(commands.map(cmd => cmd.iFaceId))];
  const cmdFormatter = ({ action, payload }) => ({ action, payload });
  coms.map(iFaceId => {
    try {
      // log.debug('[COMMANDS] interface', iFaceId, interfaces.interfaces, interfaces.interfaces[iFaceId], commands.map(cmdFormatter));
      log.info('[COMMANDS] interface', iFaceId, commands.map(cmdFormatter));
      const { send: sendCmd, connection } = interfaces.interfaces[iFaceId];
      sendCmd(connection, commands.map(cmdFormatter));
    } catch (err) {
      log.error('[COMMANDS] send error', iFaceId, err);
    }
  });
  
};

export default {
  send,
  build
}
