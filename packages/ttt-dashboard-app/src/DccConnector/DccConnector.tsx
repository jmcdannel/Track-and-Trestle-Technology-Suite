import { FunctionComponent } from "preact";
import { useEffect, useState, useId } from 'preact/hooks';
import { signal } from "@preact/signals";
import { useMqtt } from './hooks/useMqtt';
import { appendToLog as appendToDcc } from "../stores/DccStore";
import { upsertThrottle as addThrottle } from "../stores/ThrottleStore";
import { appendToLog as addTurnout } from "../stores/TurnoutStore";

interface DccListenerProps {
  layoutId: string | null
}

interface DccLogType {
  message: string,
  id: string
}

export const DccConnector: FunctionComponent<DccListenerProps> = ({ layoutId }) => {
  
  // const powerOnStates = ['<p1>', '<p1 MAIN>']
  // const powerOffStates = ['<p0>', '<p0 MAIN>']  

  const { isConnected, connect, publish, subscribe, payload: mqttMessage } = useMqtt();


  const parseDccResponse = (payload:string) => {
    // console.log('[DccListener] parseDccResponse', payload);
    if (payload.startsWith('<p')) { // power status response
      // if (powerOnStates.includes(payload)) {
      //   setPowerStatus(true);
      // } else if (powerOffStates.includes(payload)) {
      //   setPowerStatus(false);
      // }
    } else if (payload.startsWith('<l')) { // loco status response
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
      console.log('[DccListener] parseDccResponse locoResponse', locoResponse, address, dccSpeed, calculatedSpeed, direction);
    }
  }
  
  useEffect(() => {
    const parse = function() {
      try {
        const message = { data: mqttMessage?.message ?  mqttMessage.message : null };
        const { action, payload } = message.data ? JSON.parse(message.data) : { action: null, payload: null };
        console.log('[DccListener] handleDccMessage', mqttMessage, action, payload);
        switch (action) {
          case 'broadcast':
            parseDccResponse(payload);
            appendToDcc(payload);
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
