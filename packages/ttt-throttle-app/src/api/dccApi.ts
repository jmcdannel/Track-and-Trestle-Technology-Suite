import { ref, onMounted, onUnmounted } from 'vue'
import { useConnectionStore } from '../store/connectionStore.jsx'
import { useMQTT } from 'mqtt-vue-hook'

export function useDcc() {

  const mqttHook = useMQTT()
  const topic = '@ttt/dcc/betatrack'

  let ports: string[] = [];

  async function parseMessage(topic: string, message: string) {
    try {
      const { action, payload } = JSON.parse(message);
      const connStore = useConnectionStore();
      console.log('[DCC API] parseMessage', topic, message, action, payload);
      switch (action) {
        case 'listPorts':
          ports = payload
          connStore.$patch({ ports })
          break;
        case 'status':
          connStore.serialConnected = !!payload?.isConnected
          break;
        case 'connected':
          connStore.serialConnected = true
          break;
      }
    } catch { 
      console.warn('Message not in JSON format.'); 
    }
  }

  async function setPower(payload: object) {
    try {   
      console.log('[DCC API].setPower', payload);
      await send('power', payload);
    } catch (err) {
      console.error('[DCC API].setPower', err);
      throw new Error('Unable to read', err);
    }
  }

  async function setSpeed(address, speed) {
    try {   
      await send('throttle', { address, speed });
    } catch (err) {
      console.error('[DCC API].setPower', err);
      throw new Error('Unable to read', err);
    }
  }

  async function setTurnout(turnoutId, state) {
    try {   
      send('turnout', { turnoutId, state });
    } catch (err) {
      console.error('[DCC API].setTurnout', err);
      throw new Error('Unable to read', err);
    }
  }

  async function setFunction(address, func, state) {
    try {   
      await send('function', { address, func, state });
    } catch (err) {
      console.error('[DCC API].setPower', err);
      throw new Error('Unable to read', err);
    }
  }

  async function sendOutput(pin, state) {
    try {   
      console.log('[DCC API].sendOutput', pin, state);
      await send( 'output', { pin, state });
    } catch (err) {
      console.error('[DCC API].setPower', err);
      throw new Error('Unable to read', err, pin, state);
    }
  }

  async function send(action, payload) {
    try {
      console.log('[dccApi] send', action, payload);
      mqttHook.publish(topic, JSON.stringify({ action, payload }))
    } catch (err) {
      console.error('[DCC API].send', err);
    }
  }

  return {
    send,
    setPower,
    setSpeed,
    setFunction,
    sendOutput,
    setTurnout,
    parseMessage,
    ports: ports
  }

}

export default useDcc;
