import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  UNKNOWN: 'unknown',
}

export const useConnectionStore = create(
  
  persist((set, get) => ({
    host: null,
    layoutId: null,
    status: CONNECTION_STATUS.DISCONNECTED,
    dccHost: null,
    dccDevice: '',
    dccApiStatus: CONNECTION_STATUS.DISCONNECTED,
    dccDeviceStatus: CONNECTION_STATUS.DISCONNECTED,
    dccPorts: [],
    interfaces: new Map(),    
    setHost: (host) => set({ host }),
    setLayoutId: (layoutId) => set({ layoutId }),
    setStatus: (status) => set({ status }),
    setDccHost: (dccHost) => set({ dccHost }),
    setDccDevice: (dccDevice) => {
      console.log('[useConnectionStore] setDccDevice', dccDevice)
      set({ dccDevice })
    },
    setDccApiStatus: (dccApiStatus) => set({ dccApiStatus }),
    setDccDeviceStatus: (dccDeviceStatus) => set({ dccDeviceStatus }),
    setDccPorts: (dccPorts) => set({ dccPorts })
  }), {
    name: '@ttt/connection-store',
    storage: createJSONStorage(() => localStorage)
  })
)

export default useConnectionStore
