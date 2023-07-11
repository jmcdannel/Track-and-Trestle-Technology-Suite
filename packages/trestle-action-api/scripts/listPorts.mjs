import { SerialPort } from 'serialport';
// import path from 'path';
// import { fileURLToPath } from 'url';
import log from '../core/logger.mjs';

// const nodePath = path.resolve(process.argv[1]);
// const modulePath = path.resolve(fileURLToPath(import.meta.url))
// const isRunningDirectlyViaCLI = nodePath === modulePath;

export const getPorts = async () => {
  try {
    const ports = await SerialPort.list();
    return ports.map(port => port.path);
  } catch (err) {
    log.fatal(err);
  }
}

const main = async () => {
  const serialPortPaths = await getPorts();
  serialPortPaths.map(path => log.info(path));
}

// isRunningDirectlyViaCLI && main();
main();

export default getPorts;
