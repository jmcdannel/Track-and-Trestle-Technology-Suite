import React, { useEffect, useState } from 'react';
// import { getAppConfig } from '../config/config';
import jmriApi from '../Shared/api/jmriApi';
import log from 'loglevel';

// const appConfig = {
//   "layoutId": "betatrack",
//   "name": "Betatrack",
//   "api": "ws://localhost:8080",
//   "actionApi": "ws://localhost:8080",
//   "layoutApi": "http://localhost:5001/api",
//   "jmri": "http://localhost:12080/json/"
// }
const jmriHost = 'http://localhost:12080/json/'; // TODO: remove hard-coded host

function JmriEngine(props) {

  const { onReady } = props;
  const [ init, setInit ] = useState(false);

  // Initialize JMRI Websocket connection
  useEffect(() => {
    const initJmri = async () => {
      try {
        jmriApi.on('ready', 'TrackMaster', isReady => {
          onReady(isReady);
        });
        await jmriApi.setup(jmriHost);
        setInit(true);
      } catch (err) {
        setInit(false);
        log.error('JMRI initialization error', err);
      }
    };
    !init && initJmri();
  }, [onReady, init]);

  return (<></>);
}

JmriEngine.defaultProps = {
  onReady: () => { log.trace('JMRI Ready'); }
}

export default JmriEngine;