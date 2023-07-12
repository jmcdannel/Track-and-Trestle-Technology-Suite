import { WebSocketServer } from 'ws';
import dcc from './dcc.mjs';

let server
const port = 8081; // TODO: move to config
const serverId = 'DCCEXWebsocketServer'; // TODO: move to config

const MSG_CONNECTED = JSON.stringify({
  action: 'message',
  payload: `${serverId} is connected`
});

const handleClose = () => {
  log.info('[SERVER] connection closed', serverId);
}

const handleError = err => {
  log.error('[SERVER] Unexpected error occurred', serverId, err);
}

const handleConnection = (ws, resolve) => {
  log.success('[SERVER] new client connected', serverId);
  server = ws;
  // handling client connection error
  server.onerror = handleError;

  // handling what to do when clients disconnects from server
  server.on('close', handleClose);

  // handling what to do when messageis recieved
  server.on('message', async (msg) => 
    await dcc.send(msg, server));

  // sending message to client
  server.send(MSG_CONNECTED);

  resolve(ws);
}

const connect = async () => {
  return new Promise((resolve, reject) => {
    try {
      const wss = new WebSocketServer({ port });
      wss.on('connection', (ws) => handleConnection(ws, resolve));
      log.start('[SERVER] WebSocket server started', port, serverId);
    } catch (err) {
      log.error('[SERVER] error', err);
      reject(err);
    }
  });
}

export default { connect };
