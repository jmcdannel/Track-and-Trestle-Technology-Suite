import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connections', {
  state: () => ({
    mqttConnected: false,
    ports: [],
    serialConnected: false,
    layoutId: import.meta.env.VITE_LAYOUT_ID,
  })
})

export default useConnectionStore
