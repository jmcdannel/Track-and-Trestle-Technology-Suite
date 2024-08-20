import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const layoutId = process.env.LAYOUT_ID;

// const host = 'https://trestle-tt-suite-ttt-app.vercel.app'
// const baseUri = `http://127.0.0.1:5001/api/${layoutId}`;
const host = process.env.VITE_LAYOUT_API_HOST
const baseUri = `${host}/api/${layoutId}`;

const macroCommand = async (effect, delay = 0) => {
    try {
      let macroCommands = []
      log.log('API.handleMacro', effect);
      for (let e of effect.config?.on) {
        macroCommands = [...macroCommands, ...await effectCommand({ effectId: e, state: effect.state })]
      }
      for (let e of effect.config?.off) {
        macroCommands = [...macroCommands, ...await effectCommand({ effectId: e, state: !effect.state })]
      }
      return macroCommands
    } catch (err) {
      log.error('[IALED ERROR]', err?.message, JSON.stringify(effect));
    }  
}

const signalCommand = async effect => {
  const commands = [];
  await Promise.all(['red', 'yellow', 'green'].map(async color => {
    if (effect.config[color]) {
      let newState
      if (!!effect.state) {
        newState = color === 'green'
      } else {
        newState = color === 'red'
      }
      if (effect?.config?.invert) {
        newState = !newState
      }
      commands.push({ 
        iFaceId: effect?.config?.interface,
        action: 'pin', 
        payload: { 
          pin: effect.config[color],
          state: newState          
        }
      });
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
    pattern: effect?.config?.pattern,
    strip: effect?.config?.strip,
    state: effect?.state,
    r: effect?.config?.r,
    g: effect?.config?.g,
    b: effect?.config?.b
  }
});

const getEffectById = async (effectId) => {
  try {
    const uri = `${baseUri}/effects/${effectId}`;
    const resp = await fetch(uri);
    return resp.data;
  } catch (err) {
    log.error('[COMMANDS] getEffectById', err);
  }
}

const effectCommand = async (payload) => {
  try {
    const effect = await getEffectById(payload.effectId);
    
    switch(effect?.type) {
      case 'light':
      case 'frog':
      case 'relay':
      case 'pin':
      case 'power':
        return [pinCommand(effect)];
      case 'ialed':
        return [ialedCommand(effect)];
      case 'serial-ialed':
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
  } catch (err) {
    log.error('[COMMANDS] turnoutCommand', err);
  }
}

const turnoutCommand = async (payload) => {
  try {
    let commands = []
    const uri = `${host}/api/turnouts/${layoutId}/${payload.turnoutId}`
    const resp = await axios.get(uri)
    const turnout = {...resp.data, state: payload.state}
    if (turnout?.config?.effectId) {
      const efx = await getEffectById(turnout.config.effectId)
      efx.state = turnout.state
      const efxCommands =  await effectCommand(efx)
      commands = [...commands, ...efxCommands]
    }
    switch(turnout?.config?.type) {
      case 'kato':
        commands.push({
          iFaceId: turnout.config.interface,
          action: 'turnout', 
          payload: { 
            turnout: turnout.config.turnoutIdx, 
            state: turnout.state 
          }
        })
        break
      case 'servo':
        commands.push({
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
        })
        break
      default:
        // no op
        break;
    }
    return commands
  } catch (err) {
    log.error('[COMMANDS] turnoutCommand', err?.message);
  }
}

export const build = async (msg) => {
  const { action, payload } = msg
  let commandList = []
  switch(action) {
    case 'turnouts':
      commandList = await turnoutCommand(payload)
      break
    case 'effects':
      commandList = await effectCommand(payload)
      break
    default: 
      // no op
      break
  }
  // log.debug('[COMMANDS] commandList', commandList)
  return commandList
}

export const send = (commands) => {
  try {
    if (!commands || commands.length === 0) return;
    log.start('[COMMANDS] send', commands);
    const coms = [...new Set(commands.map(cmd => cmd?.iFaceId))];
    const cmdFormatter = ({ action, payload }) => ({ action, payload });
    coms.map(iFaceId => {
        // log.debug('[COMMANDS] interface', iFaceId, interfaces.interfaces, interfaces.interfaces[iFaceId], commands.map(cmdFormatter));
        log.info('[COMMANDS] interface', iFaceId, commands.map(cmdFormatter));
        const { send: sendCmd, connection } = interfaces.interfaces?.[iFaceId]
          ? interfaces.interfaces[iFaceId]
          : { send: undefined, connection: undefined }
        sendCmd && sendCmd(connection, commands.map(cmdFormatter));
    });
  } catch (err) {
    log.error('[COMMANDS] send error', err, commands);
  }
  
};

export default {
  send,
  build
}
