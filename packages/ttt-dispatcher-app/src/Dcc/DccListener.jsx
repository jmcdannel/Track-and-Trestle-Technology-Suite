import React, { useContext, useEffect } from 'react';
import log from '../Shared/utils/logger';
import api from '../Shared/api/api';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useThrottleStore } from '../Store/useThrottleStore';
import { useDccStore } from '../Store/useDccStore';
import { useMqtt } from '../Core/Com/MqttProvider'

export const DccListener = () => {
  
  const powerOnStates = ['<p1>', '<p1 MAIN>']
  const powerOffStates = ['<p0>', '<p0 MAIN>']  

  const { isConnected, publish, subscribe, payload: mqttMessage, isConnected: mqttConnected } = useMqtt();

  const setDccDeviceStatus = useConnectionStore(state => state.setDccDeviceStatus);

  const dccDevice = useConnectionStore(state => state.dccDevice);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);

  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const appendtoDccLog = useDccStore(state => state.appendtoLog);
  const setPowerStatus = useDccStore(state => state.setPowerStatus);
  const setPorts = useConnectionStore(state => state.setPorts);

  const upsertThrottle = useThrottleStore(state => state.upsertThrottle);

  const parseDccResponse = (payload) => {
    // console.log('[DccListener] parseDccResponse', payload);
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
      console.log('[DccListener] parseDccResponse locoResponse', locoResponse, address, speed, calculatedSpeed, direction);
    }
  }

  const handleDccMessage = async (message) => {
    try {
      console.log('[DccListener] handleDccMessage', message);
      const { action, payload } = message.data ? JSON.parse(message.data) : { action: null, payload: null };
      // console.log('[DccListener] handleDccMessage', action, payload);
      switch (action) {
        case 'listPorts':
          setPorts(payload);
          break;
        case 'connected':
          setDccDeviceStatus(CONNECTION_STATUS.CONNECTED);
          setDccDevice(payload.path);
          publish('ttt-dcc', {
            action: 'dcc',
            payload: 's'
          });
          break;
        case 'broadcast':
          parseDccResponse(payload);
          appendtoDccLog(payload);
          break;
      }
    } catch (err) { 
      setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
      console.error('[DccListener] handleDccMessage error', err); 
    }
  }
  
  useEffect(() => {
    const parse = function() {
      try {
        const message = JSON.parse(mqttMessage.message);
        // message && message.data && handleDccMessage(message);
        // handleDccMessage({ data: mqttMessage?.message &&  mqttMessage?.topic === 'DCCEX.js' ?  mqttMessage.message : null });
        handleDccMessage({ data: mqttMessage?.message ?  mqttMessage.message : null });
      } catch (err) {
        log.error('api initialization error', err);
      }
    };    
    mqttMessage && parse();
  }, [mqttMessage]);
  
  // Connect MQTT Client
  useEffect(() => {
    const initialize = async function() {
      try {        
        publish('ttt-dcc', JSON.stringify({ action: 'status', payload: 'dcclistener connected' }));
        subscribe('DCCEX.js');
        console.log('[DccListener] subscribed', 'DCCEX.js', isConnected);
      } catch (err) {
        log.error('api initialization error', err);
      }
    };    
    isConnected && initialize();
  }, [isConnected ]);

  // Connect DCC Device
  useEffect(() => {
    const initialize = async function() {
      console.log('[DccListener] Connect DCC Device', mqttConnected, dccDeviceStatus, dccDevice);
      try {
        setDccDeviceStatus(CONNECTION_STATUS.PENDING);
        publish('ttt-dispatcher', {
          action: 'connect',
          payload: { serial: dccDevice }
        });
      } catch (err) {
        log.error('dcc device initialization error', err);
      }
    };
    mqttConnected && dccDevice 
      && (dccDeviceStatus === CONNECTION_STATUS.DISCONNECTED || dccDeviceStatus === CONNECTION_STATUS.UNKNOWN)
      && initialize();
    !dccDevice && setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
  }, [mqttConnected, dccDeviceStatus, dccDevice]);

  return (<>{/* Intentially left blank */}</>
  );
};

export default DccListener;
