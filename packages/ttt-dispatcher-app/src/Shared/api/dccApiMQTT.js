let client; // mqtt client
let topic = 'ttt-dcc';
let isConnected = false;

async function connectDevice(port) {
  try {
    console.log('[DCC API MQTT] connectDevice', port);
    if (port) {
      await send('connect', { serial: port });
      return true;
    }
  } catch (err) {
    console.error('[DCC API MQTT] connectDevice', err);
    throw new Error('Unable to connect', err);
  }
}

function connect(_client, handleMessage = () => {}) {
  try {
    console.log('[DCC API MQTT] connect', client);
    client = _client;
    client.subscribe(topic, handleMessage);
    isConnected = true;
  } catch (err) {
    console.error('[DCC API] connect', err);
    throw new Error('Unable to connect', err);
  } finally {
    return isConnected;
  }
}

async function setPower(payload, track = 'MAIN') {
  try {
    if (typeof payload === 'undefined') {
      console.log('[DCC API].setPower', 'payload undefined');
      return;
    }
    console.log('[DCC API].setPower', payload);
    send('power', `${payload ? 1 : 0} ${track}`);
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err);
  }
}

async function setSpeed(address, speed) {
  try {   
    send('throttle', { address, speed });
  } catch (err) {
    console.error('[DCC API].setSpeed', err);
    throw new Error('Unable to read', err);
  }
}

async function setTurnout(turnoutId, state) {
  try {   
    send('turnout', { turnoutId, state });
  } catch (err) {
    console.error('[DCC API].setTurnout', err);
    throw new Error('Unable to read', err);
  }
}

async function setOutput(pin, state) {
  try {   
    send('output', { pin, state });
  } catch (err) {
    console.error('[DCC API].setTurnout', err);
    throw new Error('Unable to read', err);
  }
}

async function setFunction(address, func) {
  try {   
    send({
      action: 'function', payload: { address, func }
    });
  } catch (err) {
    console.error('[DCC API].setPower', err);
    throw new Error('Unable to read', err);
  }
}

async function send(action, payload) {
  try { 
    if (client && isConnected) {  
      sendRaw(JSON.stringify({ action, payload  }));
    } else {
      throw new Error('Not connected');
    }
  } catch (err) {
    console.error('[DCC API].send', err, action, payload);
  }
}

async function sendRaw(data) {
  try { 
    console.log('[DCC API].sendRaw', data);
    client.publish(topic, data);
  } catch (err) {
    console.error('[DCC API].sendRaw', err, data);
  }
}

function getConnectionId() {
  return connectionId;
}

export const dccApi = {
  connect,
  send,
  connectDevice,
  setOutput,
  setPower,
  setSpeed,
  setTurnout,
  setFunction,
  getConnectionId,
  isConnected
}

export default dccApi;
