// import { get as getLayoutConfig }  from '../modules/layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import serial from './serial.mjs';
import cmdex from './cmdex.mjs';
import emulator from './emulator.mjs';
import audioplayer from './audioplayer.mjs';
import commands from './commands.mjs';
import { getPorts } from '../scripts/listPorts.mjs';
import log from '../core/logger.mjs';

const interfaces = {};

const getLayout = async layoutId => {
  const uri = `http://127.0.0.1:5001/api/layouts/${layoutId}`;
  try {
    const { data } = await axios.get(uri);

    console.log('[GETLAYOUT] data', data);
    return data;
  } catch (err) {
    console.error('[GETLAYOUT]', uri, err?.message, err);
  }
}

const identifySerialConnections = async () => {
  const serialPorts = await getPorts();
  return serialPorts;
}

export const handleMessage = async (msg, ws) => {
  const commandActions = ['effets', 'turnouts'];
  const reponseActions = ['ports'];

  log.info('[INTERFACES] handleMessage', msg);
  if (commandActions.includes(msg.action)) { // command actions
    const commandList = await commands.build(msg);
    log.info('[INTERFACES] commandList', commandList);
    await commands.send(commandList);
    ws.send(JSON.stringify({ success: true, data: msg }));
  } else if (reponseActions.includes(msg.action)) { // response actions
    switch(msg.action) { 
      case 'ports':
        const response = await getPorts();
        log.info('[INTERFACES] response', response);
        ws.send(JSON.stringify({ action: msg.action, payload: response }));
        break;
      default:
        // no op
        break;
    }

  }
}

const intialize = async (com) => {
  log.info('[INTERFACES] intializing', com?.type, com?.id);
  switch(com.type) {
    case 'emulate':
      com.connection = emulator.connect();
      com.send = emulator.send;
      break;
    case 'serial':
      try {
        com.connection = await serial.connect(com);
        com.send = serial.send;
        com.status = 'connected';
      } catch (err) {
        com.status = 'fail';
        log.error(err);
      }
      break;
    case 'cmd-ex':
      try {
        com.connection = await cmdex.connect(com);
        com.send = cmdex.send;
        com.status = 'connected';
      } catch (err) {
        com.status = 'fail';
        log.error(err);
      }
      break;
    case 'audio':
      com.connection = audioplayer.connect(com);
      com.send = audioplayer.send;
      break;
    case 'default':
      log.warn('[INTERFACES] Interface type not found', com.type);
      break;
  }
  interfaces[com.id] = com;
}

export const connect = async () => {
  log.start('Connecting Interfaces');
  await identifySerialConnections();
  log.debug('LayoutID', process.env.LAYOUT_ID);
  const layoutConfig = await getLayout(process.env.LAYOUT_ID);
  layoutConfig.interfaces.map(await intialize);
}

export default { connect, interfaces, handleMessage };
