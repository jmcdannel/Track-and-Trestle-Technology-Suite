import React, { useContext, useEffect, useState } from 'react';
import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import log from '../Shared/utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useDccStore } from '../Store/useDccStore';
import { useThrottleStore } from '../Store/useThrottleStore';
import { useMqtt } from './Com/MqttProvider'
import { DccListener } from '../Dcc/DccListener';

function ApiEngine() {

  const [ state, dispatch ] = useContext(Context);
  const { connectToBroker, payload, reset } = useMqtt();

  const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);
  const setStatus = useConnectionStore(state => state.setStatus);

  const resetConnectionStatus = useConnectionStore(state => state.resetConnectionStatus);
  
  // Connect Host
  useEffect(() => {
    const initialize = async function() {
      try {
        setStatus(CONNECTION_STATUS.PENDING);
        resetConnectionStatus();
        reset();
        const result = await api.connect(dispatch, host, layoutId);
        connectToBroker();
        setStatus(result 
          ? CONNECTION_STATUS.CONNECTED
          : CONNECTION_STATUS.DISCONNECTED);
      } catch (err) {
        log.error('[ApiEngine] api initialization error', err);
      }
    };    
    host && initialize();
    !host && setStatus(CONNECTION_STATUS.DISCONNECTED);
    !layoutId && setStatus(CONNECTION_STATUS.DISCONNECTED);
  }, [host, layoutId]);
    
  return (<><DccListener /></>);
}

export default ApiEngine;