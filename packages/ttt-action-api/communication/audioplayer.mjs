import Player from '../scripts/afplayer.cjs';
import path from 'path';
import { fileURLToPath } from 'url';
import log from '../core/logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playSound = async (cmd) => {
  const player = new Player();
  log.debug('[AUDIOPLAYER] playSound', cmd, cmd.payload.file, player, Player);
  const sound = path.resolve(`${__dirname}/../sounds/${cmd.payload.file}`);
  try {
    await player.play(sound);
  } catch (err) {
    log.error('[AUDIOPLAYER]', err);
  }
}

const write = (data, onError) => {
  try {
    log.debug('[AUDIOPLAYER] write', data);
    data.map(playSound);
  } catch (err) {
    onError(err);
  }
}

const connect = () => {
  log.start('[AUDIOPLAYER] connected');
  return {write }
};

const send = (port, data) => {
  log.debug('[AUDIOPLAYER] send', data);
  port.write(data, err => {
    if (err) {
      return log.error('[AUDIOPLAYER] Error on write: ', err.message);
    }
  });
};

export default {
  connect,
  send
}