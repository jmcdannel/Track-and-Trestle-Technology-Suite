import { WebSocketServer } from 'ws';
import interfaces from '../communication/interfaces.mjs';
import log from './logger.mjs'

let server
const port = 8080; // TODO: move to config
const serverId = 'TamarackJunctionWebsocketServer'; // TODO: move to config

const MSG_CONNECTED = JSON.stringify({
  action: 'message',
  payload: `${serverId} is connected`
});

const handleClose = () => {
  log.info('[SERVER] connection closed');
}

const handleError = err => {
  log.error('[SERVER] Unexpected error occurred', err);
}

const handleConnection = (ws, resolve) => {
  log.success('[SERVER] new client connected');
  server = ws;
  // handling client connection error
  server.onerror = handleError;

  log.success('[SERVER] new client connected');

  // handling what to do when clients disconnects from server
  server.on('close', handleClose);

  // handling what to do when messageis recieved
  server.on('message', async (msg) => 
    await interfaces.handleMessage(JSON.parse(msg), server));

  // sending message to client
  server.send(MSG_CONNECTED);
  server.send(JSON.stringify({ "action": "interfaceStatus", "payload": interfaces.interfaces }));

  resolve(ws);
}

const connect = async () => {
  return new Promise((resolve, reject) => {
    try {
      const wss = new WebSocketServer({ port });
      wss.on('connection', (ws) => handleConnection(ws, resolve));
      log.start('[SERVER] WebSocket server started', port);
    } catch (err) {
      log.error('[SERVER] error', err);
      reject(err);
    }
  });
}

export default { connect };
