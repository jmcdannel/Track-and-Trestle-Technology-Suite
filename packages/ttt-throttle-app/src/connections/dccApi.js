
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
    wsDCC.send(JSON.stringify({
      action: 'power', payload
    }));
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

async function setSpeed(address, speed) {
  try {   
    wsDCC.send(JSON.stringify({
      action: 'throttle', payload: { address, speed }
    }));
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err, type);
  }
}

export const dccApi = {
  connect,
  setPower,
  setSpeed
}

export default dccApi;
