import { FunctionComponent } from "preact";
import { useEffect, useState, useId } from 'preact/hooks';
import { signal } from "@preact/signals";
import { useMqtt } from './hooks/useMqtt';
import { appendToLog as appendToDcc, deviceStatus, updateDeviceStatus } from "../../stores/DccStore";
import { upsertThrottle as addThrottle } from "../../stores/ThrottleStore";
import { appendToLog as addTurnout } from "../stores/TurnoutStore";

interface DccListenerProps {
  layoutId: string | null
}

interface DccLogType {
  message: string,
  id: string
}

export const DccConnector: FunctionComponent<DccListenerProps> = ({ layoutId }) => {
 
  const dccRegex = /<(.*?)>/;
  const dccStatusRegex = /<\*\s(.*?)\s\*>/;

  // const powerOnStates = ['<p1>', '<p1 MAIN>']
  // const powerOffStates = ['<p0>', '<p0 MAIN>']  

  const { isConnected, connect, publish, subscribe, payload: mqttMessage } = useMqtt();

  const updateThrottle = (payload: string) => {
    const locoResponse = payload
      .replace( /(^.*\<|\>.*$)/g, '' )
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
    const direction= parseInt(locoResponse[4]);
    // upsertThrottle({ address, speed: calculatedSpeed });
    addThrottle({ address, speed: calculatedSpeed });
    console.log('[DccListener] updateThrottle locoResponse', locoResponse, address, dccSpeed, calculatedSpeed, direction);
  }

  const parseDccResponse = (payload:string) => {
    const match = payload.match(dccRegex)
    const dccMessage = match ? match[1] : ''
    const parts = dccMessage.trim().split(' ');
    // console.log('parseDccResponse', dccMessage?.charAt(0), dccMessage, payload)
    switch(payload?.charAt(1)) {
      case '*' :
        const statusMessage = payload.match(dccStatusRegex)?.[1] || '';
        console.log('statusMessage', statusMessage)
        if (statusMessage.startsWith('LCD')) {
          const lcdParts = statusMessage.split(':');
          const lcdKey = lcdParts[0] === 'LCD2' ? 'powerStatus' : 'freeRam';
          const lcdValue = lcdParts?.[1];
          console.log('LCD', lcdKey, lcdValue);
          updateDeviceStatus(lcdKey, lcdValue);
        }
        break;
      case 'p':
        console.log('POWER', dccMessage, parts)
        if (parts[0] === 'p0') {
          updateDeviceStatus('trackAPower', false);
          updateDeviceStatus('trackBPower', false);
        } else if (parts[0] === 'p1') {
          if (parts?.[1] === deviceStatus.value?.trackASetting) {
            updateDeviceStatus('trackAPower', true);
          } else if (parts?.[1] === deviceStatus.value?.trackBSetting) {
            updateDeviceStatus('trackBPower', true);
          }
        }
        break;
      
      case '=':
        const track = parts[1]
        const trackType = parts[2];
        console.log('TRACK!!', track, trackType);
        updateDeviceStatus(`track${track}Setting`, trackType );
        break;
            
      case 'i':
        if (dccMessage.startsWith('iDCC-EX')) {
          const parts = dccMessage.trim().split(' / ');
          const dparts = parts?.[0].trim().split(' ');
          const mparts = parts?.[2].trim().split(' ');
          console.log('iDCC-EX', parts);
          updateDeviceStatus('version', dparts?.[1]);
          updateDeviceStatus('deviceType', parts?.[1].trim());
          updateDeviceStatus('motorShield', mparts?.[0]);
          updateDeviceStatus('clientId', mparts?.[1]);
        }
        break;
      case 'l' :
        updateThrottle(payload);
        break;
      default:
        break;
    }
    appendToDcc(payload);
  }
  
  useEffect(() => {
    const parse = function() {
      try {
        const message = { data: mqttMessage?.message ?  mqttMessage.message : null };
        const { action, payload } = message.data ? JSON.parse(message.data) : { action: null, payload: null };
        // console.log('[DccListener] handleDccMessage', mqttMessage, action, payload);
        switch (action) {
          case 'broadcast':
            parseDccResponse(payload);
            // appendToDcc(payload);
            break;
          default:
            // no op
            break;
        }
      } catch (err) {
        console.error('api initialization error', err);
      }
    };    
    mqttMessage && parse();
  }, [mqttMessage]);
  
  // Connect MQTT Client
  useEffect(() => {
    const initialize = async function() {
      try {        
        publish(`@ttt/dcc/${layoutId}`, JSON.stringify({ action: 'status', payload: 'dcclistener connected' }));
        subscribe(`@ttt/DCCEX.js/${layoutId}`, null);
      } catch (err) {
        console.error('api initialization error', err);
      }
    };
    !isConnected && connect();
    isConnected && initialize();
  }, [isConnected ]);

  return (
    <></>
  );
};

export default DccConnector;
