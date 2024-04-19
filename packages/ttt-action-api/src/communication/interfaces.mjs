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
  // const host = 'https://trestle-tt-suite-ttt-app.vercel.app'
  const host = process.env.VITE_LAYOUT_API_HOST
  const uri = `${host}/api/layouts/${layoutId}`;
  // const uri = `http://127.0.0.1:5001/api/layouts/${layoutId}`;
  try {
    const { data } = await axios.get(uri);
    console.log('[GETLAYOUT]', uri, data)
    return data?.[0];
  } catch (err) {
    console.error('[GETLAYOUT]', uri, err?.message, err);
  }
}

const identifySerialConnections = async () => {
  const serialPorts = await getPorts();
  return serialPorts;
}

export const handleMessage = async (msg, onSuccess) => {
  const commandActions = ['effects', 'turnouts'];
  const reponseActions = ['listPorts', 'connect', 'status'];

  log.info('[INTERFACES] handleMessage', msg, commandActions.includes(msg?.action));
  if (commandActions.includes(msg?.action)) { // command actions
    const commandList = await commands.build(msg);
    log.info('[INTERFACES] commandList', commandList);
    if (commandList && commandList.length > 0) {
      await commands.send(commandList);
      // onSuccess(JSON.stringify({ success: true, data: msg }));
    } else {
      onSuccess(JSON.stringify({ success: false, data: msg }));
    }
  } else if (reponseActions.includes(msg.action)) { // response actions
    switch(msg.action) { 
      case 'listPorts':
        const response = await getPorts();
        // log.info('[INTERFACES] response', response);
        onSuccess(JSON.stringify({ success: true, data: { action: 'ports', payload: response }}));
        break;
      case 'status':
        const connectedInterfaces = Object.keys(interfaces).filter(key => interfaces[key].status === 'connected');
        onSuccess(JSON.stringify({ success: true, data: { action: 'interfaces', payload: connectedInterfaces }}));
        break
      case 'connect':
        try {
          const com = { ...interfaces[msg.payload.device.id], ...msg.payload, baudRate };
          log.info('[INTERFACES] serialConnect', msg, typeof com?.serial, baudRate);
          if (!com?.serial) throw new Error('No serial port specified');

          const handleMessage = async (payload) => await onSuccess(JSON.stringify({ success: true, data: payload }));
          com.connection = await serial.connect({ path: com.serial, baudRate: com.baudRate, handleMessage });
          com.send = serial.send;
          com.status = 'connected';
          // com.connection = await serial.connect(com);
          // com.send = serial.send;
          // com.status = 'connected';
          // interfaces[msg.payload.connectionId] = com;
          interfaces[com.device.id] = com; // TODO: refactor
          log.info('[INTERFACES] serialConnected', msg, typeof com);
          onSuccess(JSON.stringify({ success: true, data:{ action: 'connected', payload: msg.payload }}));
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
  let interfaceId = com.id;
  switch(com.type) {
    case 'emulate':
      com.connection = await emulator.connect();
      com.send = emulator.send;
      break;
    case 'serial':
      try {
        // com.serial && (com.connection = await serial.connect(com));
        // com.send = serial.send;
        // com.status = 'connected';
        // com.id = 'serial'; // TODO: refactor
        interfaceId = com?.id;
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
          console.log('[IALED]', uri, JSON.stringify(data?.[0].payload));
          delete process.env['http_proxy'];
          delete process.env['HTTP_PROXY'];
          delete process.env['https_proxy'];
          delete process.env['HTTPS_PROXY'];
          const resp = await axios.post(uri, JSON.stringify(data?.[0].payload));
          return resp?. data;
        } catch (err) {
          console.error('[IALED ERROR]', uri, err?.message, JSON.stringify(data?.[0].payload));
        }
      };
      break;
    case 'default':
      log.warn('[INTERFACES] Interface type not found', com.type);
      break;
  }
  interfaces[interfaceId] = com;
}

export const connect = async () => {
  log.start('Connecting Interfaces', process.env.LAYOUT_ID);
  await identifySerialConnections();
  const layoutConfig = await getLayout(process.env.LAYOUT_ID);
  layoutConfig.interfaces?.map(await intialize);
}

export default { connect, interfaces, handleMessage };
