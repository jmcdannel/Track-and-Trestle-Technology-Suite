import { useState, useEffect } from 'preact/hooks'
import { signal } from "@preact/signals";
import mqtt from "mqtt";

// const mqttBroker = import.meta.env.VITE_MQTT_BROKER; // 'mqtt://joshs-mac-mini.local'
const mqttBroker = 'mqtt://test.mosquitto.org'; // 'mqtt://joshs-mac-mini.local'
const mqttPort = 8081;
export const connected = signal<boolean>(false);
export function useMqtt() {
  const [mqttClient, setMqttClient] = useState(null)
  const [payload, setPayload] = useState<{ topic: string, message: string } | null>(null)

  function publish(topic:string, message:any) {
    mqttClient && mqttClient.publish(topic, typeof message === 'object' ? JSON.stringify(message) : message.toString());
  }

  function subscribe(topic:string, messageHandler:Function | null) {
    mqttClient && mqttClient.subscribe(topic, messageHandler);
  }

  async function connect() {
    let client:any;
    try {
      console.log('connecting to broker', mqttBroker)
      client = await mqtt.connect(mqttBroker, { port: mqttPort })
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      client && setMqttClient(client)
    }
  }

  // Initiate MQTT CLient
  useEffect(() => {
    console.log('Initiating MQTT Client', mqttClient)
    if (mqttClient) {
      // https://github.com/mqttjs/MQTT.js#event-connect
      mqttClient.on('connect', () => {
        console.log('[mqttClient] connection successful', mqttBroker)
        connected.value = true
      })

      // https://github.com/mqttjs/MQTT.js#event-error
      mqttClient.on('error', (err) => {
        console.error('mqttClient Connection error: ', err)
        mqttClient.end()
        connected.value = false
      })

      // https://github.com/mqttjs/MQTT.js#event-reconnect
      mqttClient.on('reconnect', () => {
        console.log('mqttClient reconnecting')
      })

      // https://github.com/mqttjs/MQTT.js#event-message
      mqttClient.on('message', (topic:string, message:any) => {
        setPayload({ topic, message: message.toString() })
        // console.log(`mqttClient received message: ${message} from topic: ${topic}`, {...payload, topic })
      })
    }
  }, [mqttClient])

  return {
    publish,
    subscribe,
    connect,
    payload,
    isConnected: connected.value
  }
}

export default useMqtt;
