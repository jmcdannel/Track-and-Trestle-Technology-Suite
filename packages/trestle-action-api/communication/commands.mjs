import axios from 'axios';
// import { getById as getEffectById } from '../modules/effects.mjs';
import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const layoutId = 'betatrack'; // TODO: move to config

const baseUri = `http://127.0.0.1:5001/api/${layoutId}`;

const tunroutCommand = turnout => {
  console.log('tunroutCommand', turnout);
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
        iFaceId: turnout.config.interface,
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

const pinCommand = ({ pin, interface: iFaceId }, state, delay) => ({ 
  iFaceId,
  delay,
  action: 'pin', 
  payload: { pin, state: !!state }
});

const soundCommand = ({ file, interface: iFaceId }, state, delay) => ({ 
  iFaceId,
  delay,
  action: 'sound', 
  payload: { file, state: !!state }
});

const effectCommand = (effect, action, delay) => {
  log.debug('[COMMANDS] effectCommand', effect.type, action, delay);
  switch(effect.type) {
    case 'light':
    case 'frog':
      log.debug('[COMMANDS] light', effect);
      return pinCommand(action, effect.state, delay);
    case 'signal':
      return pinCommand(action, effect.state == action.state, delay);
    case 'sound':
      return soundCommand(action, effect.state == action.state, delay);
    default: 
      // no op
      break;
  }
}

export const build = async (msg) => {
  log.debug('[COMMANDS] build', msg);
  const { action, payload } = msg;
  let commandList = [];
  let uri;
  let resp;
  switch(action) {
    case 'turnouts':
      uri = `${baseUri}/turnouts/${payload.turnoutId}`;
      log.log('[COMMANDS] turnouts.uri', uri);
      resp = await axios.get(uri);
      const turnout = {...resp.data, state: payload.state};
      commandList.push(tunroutCommand(turnout));
      // TO DO: refactor
      // turnout.effects && turnout.effects.filter(efx => !efx.delay).map(turnoutEffect => {
      //   const effect = getEffectById(turnoutEffect.effectId);
      //   effect.state = turnoutEffect.state;
      //   const effectCommandList = effect?.actions.map(action => effectCommand(effect, action, turnoutEffect.delay));
      //   commandList = commandList.concat(effectCommandList);
      // });
      break;
    case 'effects':
      uri = `${baseUri}/effects/${payload.effectId}`;
      log.log('[COMMANDS] effect.uri', uri);
      resp = await axios.get(uri);
      log.log('[COMMANDS] effect.resp', resp, resp.data);
            // return json from axios response

      let effect = resp.data;
      effect.state = payload.state;
      
      log.debug('[COMMANDS] effect', effect, resp.data, typeof effect, typeof resp.data, msg);
      const effectCommandList = effect?.actions?.map(action => effectCommand(effect, action));
      if (effectCommandList?.length > 0) {
        commandList = commandList.concat(effectCommandList);
      }
      break;
    default: 
      // no op
      break;
  }
  log.debug('[COMMANDS] commandList', commandList);
  return commandList;
}

export const send = (commands) => {
  log.debug('[COMMANDS] send', commands);
  const coms = [...new Set(commands.map(cmd => cmd.iFaceId))];
  log.debug('[COMMANDS] coms', coms);
  const cmdFormatter = ({ action, payload }) => ({ action, payload });
  coms.map(iFaceId => {
    try {
      log.debug('[COMMANDS] interfaces',  interfaces.interfaces);
      log.debug('[COMMANDS] interface', iFaceId, interfaces.interfaces[iFaceId]);
      const { send, connection } = interfaces.interfaces[iFaceId];
      send(connection, commands.map(cmdFormatter));
    } catch (err) {
      log.error('[COMMANDS] send error', iFaceId, err);
    }
  });
  
};

export default {
  send,
  build
}
