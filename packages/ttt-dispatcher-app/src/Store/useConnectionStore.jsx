import { create } from 'zustand'

const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
}

const useConnectionStore = create((set) => ({
  host: null,
  status: CONNECTION_STATUS.DISCONNECTED,
  interfaces: [],
  addInterface: (iface) => set((state) => ({ interfaces: [...state.interfaces, iface] })),
  removeInterface: (iface) => set((state) => ({ interfaces: state.interfaces.filter(i => i !== iface) })),
  setHost: (host) => set({ host }),
  setStatus: (status) => set({ status })
}))

export default useConnectionStore
