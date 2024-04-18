import mqtt from "mqtt";
import log from './logger.mjs'
import interfaces from '../communication/interfaces.mjs';

const layoutId = process.env.LAYOUT_ID
const mqttBroker = process.env.VITE_MQTT_BROKER || 'mqtt://localhost';
// const mqttBroker = 'mqtt://test.mosquitto.org'
// const mqttPort = 5005;
const mqttPort = 8081;

let mqttClient;

const handleSubscribeError = (error) => {
  if (error) {
    console.log('Subscribe to topics error', error)
    return
  }
}

// Function to connect to MQTT broker
const connect = () => {
  mqttClient = mqtt.connect(mqttBroker);
  // https://github.com/mqttjs/MQTT.js#event-connect
  mqttClient.on('connect', () => {
    log.log('mqttClient connection successful', mqttBroker)
    mqttClient.publish(`@ttt/dispatcher/${layoutId}`, JSON.stringify({ action: 'status', paylod: 'Hello mqtt' }))
    mqttClient.subscribe(`@ttt/dispatcher/${layoutId}`, handleSubscribeError)
    mqttClient.subscribe(`@ttt/turnout/${layoutId}`, handleSubscribeError)
  })

  // https://github.com/mqttjs/MQTT.js#event-error
  mqttClient.on('error', (err) => {
    log.error('mqttClient Connection error: ', err)
    mqttClient.end()
  })

  // https://github.com/mqttjs/MQTT.js#event-reconnect
  mqttClient.on('reconnect', () => {
    log.log('mqttClient reconnecting')
  })

  // https://github.com/mqttjs/MQTT.js#event-message
  mqttClient.on('message', (topic, message) => {
    // console.log(`mqttClient received message: ${message} from topic: ${topic}`)
    // console.log('message', message, typeof message)
    interfaces.handleMessage(JSON.parse(message.toString()), 
      (resp) => mqttClient.publish(`@ttt/dispatcher/${layoutId}`, resp  )
    );
  })
};

// Function to disconnect from MQTT broker
const disconnect = () => {
  mqttClient.end();
  setMqttStatus(CONNECTION_STATUS.DISCONNECTED);
};

const send = (topic, message) => {
  if (mqttClient) {
    mqttClient.publish(topic, message);
  }
}

export default { connect, send, disconnect }