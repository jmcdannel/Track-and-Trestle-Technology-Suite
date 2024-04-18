import { createContext, useContext, useEffect, useState } from 'react';
import mqtt from "mqtt";

const mqttBroker = import.meta.env.VITE_MQTT_BROKER; // 'mqtt://joshs-mac-mini.local'
const mqttPort = 8081;

console.log('[MqttProvider] mqttBroker', mqttBroker)

// Create a context for the MQTT provider
const MqttContext = createContext();

export default function MqttProvider({ children }) {
  const [mqttClient, setMqttClient] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [payload, setPayload] = useState(null)

  // Function to connect to MQTT broker
  const connectToBroker = async () => {
    let client;
    try {
      console.log('connecting to broker', mqttBroker)
      client = await mqtt.connect(mqttBroker, { port: mqttPort })
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setMqttClient(client)
    }
    
  };

  // Function to disconnect from MQTT broker
  const disconnectFromBroker = () => {
    mqttClient.end();
  };

  const subscribe = (topic, messageHandler) => {
    mqttClient && mqttClient.subscribe(topic, messageHandler);
  }

  const publish = (topic, message) => {
    mqttClient && mqttClient.publish(topic, typeof message === 'object' ? JSON.stringify(message) : message.toString());
  }

  const reset = () => {
    setMqttClient(null);
    setIsConnected(false);
    setPayload(null);
  }

  // Value object to be provided by the provider
  const value = {
    mqttClient,
    payload,
    isConnected,
    broker: mqttBroker,
    publish,
    subscribe,
    dcc: (action, payload) => publish('ttt-dcc', JSON.stringify({ action, payload })),
    reset,
    connect: connectToBroker,
    disconnected: disconnectFromBroker,
  };

  // Initiate MQTT CLient
  useEffect(() => {
    console.log('Initiating MQTT Client', mqttClient)
    if (mqttClient) {
      // https://github.com/mqttjs/MQTT.js#event-connect
      mqttClient.on('connect', () => {
        console.log('[mqttClient] connection successful', mqttBroker)
        setIsConnected(true)
      })

      // https://github.com/mqttjs/MQTT.js#event-error
      mqttClient.on('error', (err) => {
        console.error('mqttClient Connection error: ', err)
        mqttClient.end()
        setIsConnected(false)
      })

      // https://github.com/mqttjs/MQTT.js#event-reconnect
      mqttClient.on('reconnect', () => {
        console.log('mqttClient reconnecting')
      })

      // https://github.com/mqttjs/MQTT.js#event-message
      mqttClient.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() }
        setPayload({...payload, topic })
        // console.log(`mqttClient received message: ${message} from topic: ${topic}`, {...payload, topic })
      })
    }
  }, [mqttClient])

  return (
    <MqttContext.Provider value={value}>
      {children}
    </MqttContext.Provider>
  );
};

export function useMqtt() {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return context;
}
