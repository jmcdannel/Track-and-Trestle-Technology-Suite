import { FunctionComponent } from "preact";
import { useState, useEffect } from 'preact/hooks'
import mqtt, { MqttClient } from "mqtt";

const mqttBroker = 'mqtt://joshs-mac-mini.local'
const mqttPort = 5005

const CurrentMonitor: FunctionComponent<{ title: string }> = ({ title, children }) => {
  const [current, setCurrent] = useState(0)
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [payload, setPayload] = useState(null)

  function handleMqttMessage(topic: string, message: Buffer) {
    console.log(`[mqttClient] message received: ${message.toString()}`)
    // setPayload(message.toString())
  }

  useEffect(() => {
    setMqttClient(mqtt.connect(mqttBroker, { port: mqttPort }))
  }, [])

  useEffect(() => {

    if (mqttClient) {
      mqttClient.on('connect', () => {
        console.log('[mqttClient] connection successful')
        setIsConnected(true)
      })
      mqttClient.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() }
        // setPayload({ ...payload })
        console.log(`mqttClient received message: ${message} from topic: ${topic}`, {...payload, topic })
      })
      mqttClient.subscribe('ttt-dcc', handleMqttMessage)
    }

  }, [mqttClient])

  setInterval(() => {
    // mqttClient?.publish('ttt-dcc', JSON.stringify({ action: 'dcc', payload: 'JI'}))
  }, 10000)

  return (
    <div>
      <h1><slot name="title">{title}</slot></h1>
      <p>Current: {current}</p>
      {children }
    </div>
  )
}

export default CurrentMonitor
