import { create } from 'zustand'

const store =(set, get) => ({
  powerStatus: undefined,
  setPowerStatus: (powerStatus) => set({ powerStatus }),
  log: [],
  appendtoLog: (item) => set(state => ({ log: [...state.log, item] }))
})

export const useDccStore = create(store)

export default useDccStore
