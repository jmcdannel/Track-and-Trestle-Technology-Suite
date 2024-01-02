import React, { useContext, useEffect } from 'react';
import log from '../Shared/utils/logger';
import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useThrottleStore } from '../Store/useThrottleStore';
import { useDccStore } from '../Store/useDccStore';

export const DccListener = () => {
  
  const powerOnStates = ['<p1>', '<p1 MAIN>']
  const powerOffStates = ['<p0>', '<p0 MAIN>']
  
  const [ state ] = useContext(Context);
  const { layout } = state;

  const host = useConnectionStore(state => state.host);
  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);
  const setDccApiStatus = useConnectionStore(state => state.setDccApiStatus);
  const setDccDeviceStatus = useConnectionStore(state => state.setDccDeviceStatus);

  const appendtoDccLog = useDccStore(state => state.appendtoLog);
  const setPowerStatus = useDccStore(state => state.setPowerStatus);
  const setDccPorts = useConnectionStore(state => state.setDccPorts);

  const upsertThrottle = useThrottleStore(state => state.upsertThrottle);

  const parseDccResponse = (payload) => {
    console.log('[ApiEngine] parseDccResponse', payload);
    if (payload.startsWith('<p')) {
      if (powerOnStates.includes(payload)) {
        setPowerStatus(true);
      } else if (powerOffStates.includes(payload)) {
        setPowerStatus(false);
      }
    } else if (payload.startsWith('<l')) {
      const locoResponse = payload
        .replace( /(^.*\<|\>.*$)/g, '' )
        .split(' ');
      const address = parseInt(locoResponse[1]);
      const speed = parseInt(locoResponse[3]);
      const calculatedSpeed = speed < 127
        ? -speed + 1
        : speed - 129;
      const direction= parseInt(locoResponse[4]);
      upsertThrottle({ address, speed: calculatedSpeed });
      console.log('[ApiEngine] parseDccResponse locoResponse', locoResponse, address, speed, calculatedSpeed, direction);
    }
  }

  const handleDccMessage = async (message) => {
    try {
      const { action, payload } = JSON.parse(message.data);
      console.log('[ApiEngine] handleDccMessage', action, payload, message);
      switch (action) {
        case 'listPorts':
          setDccPorts(payload);
          break;
        case 'socketConnected':
          setDccApiStatus(CONNECTION_STATUS.CONNECTED);
          break;
        case 'connected':
          setDccDeviceStatus(CONNECTION_STATUS.CONNECTED);
          setDccDevice(payload.path);
          await api.dcc.send('dcc', 's')
          break;
        case 'broadcast':
          console.log('[ApiEngineDCCLOG] broadcast', payload);
          parseDccResponse(payload);
          appendtoDccLog(payload);
          break;
      }
    } catch (err) { 
      setDccApiStatus(CONNECTION_STATUS.DISCONNECTED);
      setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
      console.error('[ApiEngine] handleDccMessage error', err); 
    }
  }

  // Connect Host Interfaces
  useEffect(() => {
    console.log('[ApiEngine] layout', layout);

    if (layout?.interfaces?.find(i => i.type === 'dcc-js-api')) {
      setDccApiStatus(CONNECTION_STATUS.PENDING);
      api.dcc.connect(host, handleDccMessage);
    }

  }, [layout]);

  return (<>{/* Intentially left blank */}</>
  );
};

export default DccListener;
