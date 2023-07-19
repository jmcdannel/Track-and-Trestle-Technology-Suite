import React, { useEffect, useState } from 'react';
import { getAppConfig } from '../config/config';
import jmriApi from '../Shared/jmri/jmriApi';
import log from 'loglevel';

function JmriEngine(props) {

  const { onReady } = props;
  const [ init, setInit ] = useState(false);
  const appConfig = getAppConfig();

  // Initialize JMRI Websocket connection
  useEffect(() => {
    const initJmri = async () => {
      try {
        jmriApi.on('ready', 'TrackMaster', isReady => {
          onReady(isReady);
        });
        await jmriApi.setup(appConfig.jmri);
        setInit(true);
      } catch (err) {
        setInit(false);
        log.error('JMRI initialization error', err);
      }
    };
    !init && initJmri();
  }, [appConfig.jmri, onReady, init]);

  return (<></>);
}

JmriEngine.defaultProps = {
  onReady: () => { log.trace('JMRI Ready'); }
}

export default JmriEngine;