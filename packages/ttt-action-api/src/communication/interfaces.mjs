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
const baudRate = 115200;

const getLayout = async layoutId => {
  const uri = `http://127.0.0.1:5001/api/layouts/${layoutId}`;
  try {
    const { data } = await axios.get(uri);
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
  const commandActions = ['effects', 'turnouts'];
  const reponseActions = ['ports', 'serialConnect'];

  log.info('[INTERFACES] handleMessage', msg, commandActions.includes(msg?.action));
  if (commandActions.includes(msg?.action)) { // command actions
    const commandList = await commands.build(msg);
    log.info('[INTERFACES] commandList', commandList);
    if (commandList && commandList.length > 0) {
      await commands.send(commandList);
      ws.send(JSON.stringify({ success: true, data: msg }));
    } else {
      ws.send(JSON.stringify({ success: false, data: msg }));
    }
  } else if (reponseActions.includes(msg.action)) { // response actions
    switch(msg.action) { 
      case 'ports':
        const response = await getPorts();
        log.info('[INTERFACES] response', response);
        ws.send(JSON.stringify({ action: msg.action, payload: response }));
        break;
      case 'serialConnect':
        try {
          const com = { ...interfaces[msg.payload.connectionId], ...msg.payload, baudRate };
          log.info('[INTERFACES] serialConnect', msg, com?.serial, baudRate);
          com.connection = await serial.connect(com);
          com.send = serial.send;
          com.status = 'connected';
          // com.connection = await serial.connect(com);
          // com.send = serial.send;
          // com.status = 'connected';
          interfaces[msg.payload.connectionId] = com;
          ws.send(JSON.stringify({ action: 'connected', payload: msg.payload }));
        } catch (err) {
          log.error('[INTERFACES] connect', err);
        }
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
        com.serial && (com.connection = await serial.connect(com));
        com.send = serial.send;
        com.status = 'connected';
      } catch (err) {
        com.status = 'fail';
        log.error(err);
      }
      break;
    // case 'cmd-ex':
    //   try {
    //     com.connection = await cmdex.connect(com);
    //     com.send = cmdex.send;
    //     com.status = 'connected';
    //   } catch (err) {
    //     com.status = 'fail';
    //     log.error(err);
    //   }
    //   break;
    case 'audio':
      com.connection = audioplayer.connect(com);
      com.send = audioplayer.send;
      break;
    case 'ialed':
      const uri =
      com.connection = `${com.config.address}/led`;
      com.send = async (uri, data) => {
        try {
          const resp = await axios.post(uri, JSON.stringify(data?.[0].payload));
          return resp?. data;
        } catch (err) {
          console.error('[IALED ERROR]', uri, err?.message, JSON.stringify(data?.[0].payload), err);
        }
      };
      break;
    case 'default':
      log.warn('[INTERFACES] Interface type not found', com.type);
      break;
  }
  interfaces[com.id] = com;
}

export const connect = async () => {
  log.start('Connecting Interfaces', process.env.LAYOUT_ID);
  await identifySerialConnections();
  const layoutConfig = await getLayout(process.env.LAYOUT_ID);
  layoutConfig.interfaces.map(await intialize);
}

export default { connect, interfaces, handleMessage };
