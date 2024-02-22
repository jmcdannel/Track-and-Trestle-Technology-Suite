import { useEffect, useState } from 'react';
import mqtt from "mqtt";
import log from '../Shared/utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

const mqttBroker = 'mqtt://joshs-mac-mini.local'
const mqttPort = 5005;

const useMqtt = () => {
  const [mqttClient, setMqttClient] = useState(null)
  const [payload, setPayload] = useState({})

  const mqttStatus = useConnectionStore(state => state.mqttStatus);
  const setMqttStatus = useConnectionStore(state => state.setMqttStatus);

  function publish(topic, message) {
    mqttClient.publish(topic, message);
  }

  // Initiate MQTT CLient
  useEffect(() => {
    if (mqttClient) {
      // https://github.com/mqttjs/MQTT.js#event-connect
      mqttClient.on('connect', () => {
        setMqttStatus(CONNECTION_STATUS.CONNECTED);
        console.log('mqttClient connection successful')
      })

      // https://github.com/mqttjs/MQTT.js#event-error
      mqttClient.on('error', (err) => {
        console.error('mqttClient Connection error: ', err)
        mqttClient.end()
        setMqttStatus(CONNECTION_STATUS.DISCONNECTED);
      })

      // https://github.com/mqttjs/MQTT.js#event-reconnect
      mqttClient.on('reconnect', () => {
        setMqttStatus(CONNECTION_STATUS.PENDING);
        console.log('mqttClient reconnecting')
      })

      // https://github.com/mqttjs/MQTT.js#event-message
      mqttClient.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() }
        setPayload(payload)
        console.log(`mqttClient received message: ${message} from topic: ${topic}`)
      })
    }
  }, [mqttClient])
  
  // Connect MQTT Client
  useEffect(() => {
    const initialize = async function() {
      try {        
        setMqttStatus(CONNECTION_STATUS.PENDING);
        // setMqttClient(mqtt.connect(mqttBroker, { port: mqttPort }));
      } catch (err) {
        log.error('api initialization error', err);
      }
    };    
    (mqttStatus === CONNECTION_STATUS.DISCONNECTED || mqttStatus === CONNECTION_STATUS.UNKNOWN) 
      && initialize();
  }, [mqttStatus]);
  
  return { mqttClient, payload, publish }
};

export default useMqtt;
