import axios from 'axios';
import serial from './serial.mjs';
import emulator from './emulator.mjs';
import audioplayer from './audioplayer.mjs';
import commands from './commands.mjs';
import { getPorts } from '../scripts/listPorts.mjs';
import log from '../core/logger.mjs';

const interfaces = {};
const baudRate = 115200;

const getLayout = async layoutId => {
  // const host = 'https://trestle-tt-suite-ttt-app.vercel.app'
  // const uri = `http://127.0.0.1:5001/api/layouts/${layoutId}`;
  const host = process.env.VITE_LAYOUT_API_HOST
  const uri = `${host}/api/layouts/${layoutId}`;
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

async function handleCommandMessage(msg, onSuccess) {
  const commandList = await commands.build(msg);
  log.info('[INTERFACES] commandList', commandList);
  if (commandList && commandList.length > 0) {
    await commands.send(commandList);
    // onSuccess(JSON.stringify({ success: true, data: msg }));
  } else {
    // onSuccess(JSON.stringify({ success: false, data: msg }));
  }
}

async function handleResponseMessage(msg, onSuccess) {
  switch(msg.action) { 
    case 'listPorts':
      const response = await getPorts();
      // log.info('[INTERFACES] response', response);
      onSuccess(JSON.stringify({ success: true, data: { action: 'portList', payload: response }}));
      break;
    case 'status':
      const connectedInterfaces = Object.keys(interfaces).filter(key => interfaces[key].isConnected);
      onSuccess(JSON.stringify({ success: true, data: { action: 'interfaces', payload: connectedInterfaces }}));
      break
    case 'connect':
      connectSerialDevice(msg, onSuccess);
      break;
    default:
      // no op
      break;
  }
}

async function connectSerialDevice(msg, onSuccess) {
  try {
    const com = interfaces[msg.payload.device.id];
    if (!com.isConnected) {
      // const handleMessage = async (payload) => await onSuccess(JSON.stringify({ success: true, data: payload }));
      const handleMessage = async (payload) => console.log('[SERIAL] handleMessage', payload);
      const port = await serial.connect({ path: msg.payload.serial, baudRate, handleMessage });
      com.connection = port;
      com.send = serial.send;
      com.isConnected = true;
    }    
    await onSuccess(JSON.stringify({ success: true, data: { action: 'connected', payload: msg.payload }}));
    log.info('[INTERFACES] serialConnected', msg, typeof com);
  } catch (err) {
    log.error('[INTERFACES] connect', err);
  }
}

export const handleMessage = async (msg, onSuccess) => {
  const commandActions = ['effects', 'turnouts'];
  const reponseActions = ['listPorts', 'connect', 'status'];

  log.info('[INTERFACES] handleMessage', msg, commandActions.includes(msg?.action));
  if (commandActions.includes(msg?.action)) { // command actions
    handleCommandMessage(msg, onSuccess);
  } else if (reponseActions.includes(msg.action)) { // response actions
    handleResponseMessage(msg, onSuccess);
  }
}

const intializeDevice = async (com) => {
  log.info('[INTERFACES] intializing', com?.type, com?.id);
  let interfaceId = com.id;
  switch(com.type) {
    case 'emulate':
      com.connection = await emulator.connect();
      com.send = emulator.send;
      com.isConnected = true;
      break;
    case 'serial':
      try {
        // TODO: refactor
        com.isConnected = false;
        interfaceId = com?.id;
      } catch (err) {
        com.isConnected = false;
        log.error(err);
      }
      break;
    case 'audio':
      com.connection = audioplayer.connect(com);
      com.send = audioplayer.send;
      com.isConnected = true;
      break;
    case 'default':
      log.warn('[INTERFACES] Interface type not found', com.type);
      break;
  }
  interfaces[interfaceId] = com;
}

export const initialize = async () => {
  log.start('Initializing Interfaces', process.env.LAYOUT_ID);
  await identifySerialConnections();
  const layoutConfig = await getLayout(process.env.LAYOUT_ID);
  layoutConfig.interfaces?.map(await intializeDevice);
}

export default { initialize, interfaces, handleMessage };
