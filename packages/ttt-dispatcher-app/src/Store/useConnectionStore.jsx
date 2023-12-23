import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  UNKNOWN: 'unknown',
}

const store = immer(
  
  persist((set, get) => ({
    host: null,
    layoutId: null,
    dccDevice: null,
    dccPorts: [],
    actionPorts: [],
    status: CONNECTION_STATUS.DISCONNECTED,
    actionDevices: [],
    dccApiStatus: CONNECTION_STATUS.DISCONNECTED,
    dccDeviceStatus: CONNECTION_STATUS.DISCONNECTED,
    actionApiStatus: CONNECTION_STATUS.DISCONNECTED,

    setHost: (host) => set({ host }),
    setLayoutId: (layoutId) => set({ layoutId }),

    setDccDevice: (dccDevice) => {
      console.log('[useConnectionStore] setDccDevice', dccDevice)
      set({ dccDevice })
    },
    setDccPorts: (dccPorts) => set({ dccPorts }),
    setActionPorts: (actionPorts) => set({ actionPorts }),

    addActionDevice: (device) => {
      set(state => ({
        actionDevices: [...state.actionDevices, { ...device, status: CONNECTION_STATUS.DISCONNECTED }]
      }))
    },

    updateActionDevice: (device) => {
      set(state => ({
        actionDevices: [...state.actionDevices.map(d => {
          if (d.id === device.id) {
            return device;
          }
          return d;
        })]
      }))
    },

    updateActionDeviceStatusByPort: (port, status) => {
      set(state => ({
        actionDevices: [...state.actionDevices.map(d => {
          if (d.port === port) {
            return {...d, ...{ status }};
          }
          return d;
        })]
      }))
    },

    setStatus: (status) => set({ status }),
    setDccApiStatus: (dccApiStatus) => set({ dccApiStatus }),
    setDccDeviceStatus: (dccDeviceStatus) => set({ dccDeviceStatus }),
    setActionApiStatus: (actionApiStatus) => set({ actionApiStatus }),
  }), {
    name: '@ttt/connection-store',
    storage: createJSONStorage(() => localStorage)
  })
)

export const useConnectionStore = create(store)

export default useConnectionStore
