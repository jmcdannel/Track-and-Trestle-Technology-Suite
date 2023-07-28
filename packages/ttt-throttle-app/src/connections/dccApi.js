
let wsDCC;

function onOpen() {
  console.log('[DCC API] onOpen');
}

function onError(event) {
  console.log('[DCC API] Websocket error', event);
}

function onMessage(event) {
  try {
    console.log('[DCC API] onMessage', event.data);
  } catch { 
    console.warn('Message not in JSON format.', event.data); 
  }
}

async function connect() {
  wsDCC = new WebSocket('ws://joshs-mac-mini.local:8081');
  wsDCC.onerror = onError;
  wsDCC.addEventListener('open', onOpen);   
  wsDCC.addEventListener('message',  onMessage);
}

async function setPower(payload) {
  try {   
    send('power', payload);
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

async function setSpeed(address, speed) {
  try {   
    send('throttle', { address, speed });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

async function setFunction(address, func) {
  try {   
    send({
      action: 'function', payload: { address, func }
    });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

async function send(action, payload) {
  try {   
    wsDCC.send(JSON.stringify({ action, payload  }));
  } catch (err) {
    console.error('[DCC API].send', err);
    throw new Error('Unable to send', err, action, payload);
  }
}

export const dccApi = {
  connect,
  send,
  setPower,
  setSpeed,
  setFunction
}

export default dccApi;
