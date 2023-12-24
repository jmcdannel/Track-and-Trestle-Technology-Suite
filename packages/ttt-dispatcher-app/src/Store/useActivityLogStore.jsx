import { create } from 'zustand'

const store =(set, get) => ({
    dccLog: [],
    appendtoDccLog: (item) => set(state => ({ dccLog: [...state.dccLog, item] }))
})

export const useActivityLogStore = create(store)

export default useActivityLogStore
