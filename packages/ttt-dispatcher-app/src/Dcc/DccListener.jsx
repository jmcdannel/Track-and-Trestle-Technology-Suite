import React, { useContext, useEffect } from 'react';
import log from '../Shared/utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useThrottleStore } from '../Store/useThrottleStore';
import { useDccStore } from '../Store/useDccStore';
import { useMqtt } from '../Core/Com/MqttProvider'

export const DccListener = () => {

  const powerOnStates = ['<p1>', '<p1 MAIN>']
  const powerOffStates = ['<p0>', '<p0 MAIN>']

  const { isConnected, publish, subscribe, payload: mqttMessage, isConnected: mqttConnected } = useMqtt();

  const layoutId = useConnectionStore(state => state.layoutId);
  const setDccDeviceStatus = useConnectionStore(state => state.setDccDeviceStatus);

  const dccDevice = useConnectionStore(state => state.dccDevice);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);

  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const appendtoDccLog = useDccStore(state => state.appendtoLog);
  const setPowerStatus = useDccStore(state => state.setPowerStatus);
  const setPorts = useConnectionStore(state => state.setPorts);

  const upsertThrottle = useThrottleStore(state => state.upsertThrottle);

  const publishTopic = `@ttt/dcc/${layoutId}`;
  const subscribeTopic = `@ttt/DEJA.js/${layoutId}`;

  const parseDccResponse = (payload) => {
    // console.log('[DccListener] parseDccResponse', payload);
    if (payload.startsWith('<p')) { // power status response
      if (powerOnStates.includes(payload)) {
        setPowerStatus(true);
      } else if (powerOffStates.includes(payload)) {
        setPowerStatus(false);
      }
    } else if (payload.startsWith('<l')) { // loco status response
      const locoResponse = payload
        .replace(/(^.*\<|\>.*$)/g, '')
        .split(' ');
      const address = parseInt(locoResponse[1]);
      const dccSpeed = parseInt(locoResponse[3]);
      let calculatedSpeed = 0;
      if (dccSpeed === 0) {
        calculatedSpeed = 0
      } else if (dccSpeed < 127) {
        calculatedSpeed = -dccSpeed + 1;
      } else {
        calculatedSpeed = dccSpeed - 129;
      }
      const direction = parseInt(locoResponse[4]);
      upsertThrottle({ address, speed: calculatedSpeed });
      console.log('[DccListener] parseDccResponse locoResponse', locoResponse, address, dccSpeed, calculatedSpeed, direction);
    }
  }

  useEffect(() => {
    const parse = function () {
      try {
        const message = { data: mqttMessage?.message ? mqttMessage.message : null };
        const topic = mqttMessage?.topic ? mqttMessage.topic : null;
        console.log('[DccListener] handleDccMessage', message, topic);
        if (topic !== subscribeTopic) return; // ignore topics not subscribed
        const { action, payload } = message.data ? JSON.parse(message.data) : { action: null, payload: null };

        switch (action) {
          case 'connected':
            setDccDeviceStatus(CONNECTION_STATUS.CONNECTED);
            setDccDevice(payload.path);
            publish(publishTopic, {
              action: 'dcc',
              payload: 's'
            });
            break;
          case 'portList':
            setPorts(payload);
            break;
          case 'broadcast':
            parseDccResponse(payload);
            const firstChar = payload?.charAt(1)
            const ignore = ['j']
            if (!ignore.includes(firstChar)) {
              appendtoDccLog(payload);
            }
            break;
        }
      } catch (err) {
        log.error('api initialization error', err);
      }
    };
    mqttMessage && parse();
  }, [mqttMessage]);

  // Connect MQTT Client
  useEffect(() => {
    const initialize = async function () {
      try {
        publish(publishTopic, JSON.stringify({ action: 'status', payload: 'dcclistener connected' }));
        subscribe(subscribeTopic);
      } catch (err) {
        log.error('api initialization error', err);
      }
    };
    isConnected && initialize();
  }, [isConnected]);

  // Connect DCC Device
  useEffect(() => {
    const initialize = async function () {
      console.log('[DccListener] Connect DCC Device', mqttConnected, dccDeviceStatus, dccDevice);
      try {
        setDccDeviceStatus(CONNECTION_STATUS.PENDING);
        publish(publishTopic, {
          action: 'connect',
          payload: { serial: dccDevice, dcc: true }
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
