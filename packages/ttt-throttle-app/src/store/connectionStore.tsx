import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connections', {
  state: () => ({
    mqttConnected: false,
    ports: [],
    dccExConnected: false,
    serialConnected: false,
    isEmulated: false,
    layoutId: localStorage.getItem('@DEJA/layoutId') || null
  })
})

export default useConnectionStore
