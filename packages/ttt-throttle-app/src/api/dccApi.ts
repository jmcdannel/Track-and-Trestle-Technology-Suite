import { ref, onMounted, onUnmounted } from 'vue'
import { useConnectionStore } from '../store/connectionStore.jsx'
import { storeToRefs } from 'pinia'
import { useMQTT } from 'mqtt-vue-hook'

export function useDcc() {

  const mqttHook = useMQTT()
  const connStore = useConnectionStore()
  const { layoutId } = storeToRefs(connStore)
  const topic = `@ttt/dcc/${layoutId}`

  let ports: never[] = [];

  async function parseMessage(topic: string, message: string) {
    try {
      const { action, payload } = JSON.parse(message);
      console.log('[DCC API] parseMessage', topic, message, action, payload);
      switch (action) {
        case 'listPorts':
          ports = payload || []
          connStore.ports = ports
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
    } catch (err:any) {
      console.error('[DCC API].setPower', err);
      throw new Error(err);
    }
  }

  async function setSpeed(address: any, speed: any) {
    try {   
      await send('throttle', { address, speed });
    } catch (err:any) {
      console.error('[DCC API].setPower', err);
      throw new Error(err);
    }
  }

  async function setTurnout(turnoutId: any, state: any) {
    try {   
      send('turnout', { turnoutId, state });
    } catch (err:any) {
      console.error('[DCC API].setTurnout', err);
      throw new Error(err);
    }
  }

  async function setFunction(address: any, func: any, state: any) {
    try {   
      await send('function', { address, func, state });
    } catch (err:any) {
      console.error('[DCC API].setPower', err);
      throw new Error(err);
    }
  }

  async function sendOutput(pin: any, state: any) {
    try {   
      console.log('[DCC API].sendOutput', pin, state);
      await send( 'output', { pin, state });
    } catch (err:any) {
      console.error('[DCC API].setPower', err);
      throw new Error(err);
    }
  }

  async function send(action: string, payload?: object) {
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
