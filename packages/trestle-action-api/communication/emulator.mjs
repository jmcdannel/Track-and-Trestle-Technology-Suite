import log from '../core/logger.mjs';

const connect = () => ({
  write: (data, onError) => {
    try {
      log.watch('[EMULATOR] write', data);
    } catch (err) {
      onError(err);
    }
  }
});

const send = (port, data) => {
  log.debug('[EMULATOR] send', data);
  port.write(`${JSON.stringify(data)}\n`, err => {
    if (err) {
      return log.error('[EMULATOR] Error on write: ', err.message);
    }
  });
};

export default {
  connect,
  send
}