import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const store = persist((set, get) => ({
  locos: [],
  updateLoco: (loco) => set(state => ({
    locos: [...state.locos.map(t => {
      if (t.locoId === loco.locoId) {
        return {...t, ...loco}
      }
      return t;
    })]
  })),
  initLocos: (locos) => set({ locos }),
}), {
  name: '@ttt/loco-store',
  storage: createJSONStorage(() => sessionStorage)
});


export const useLocoStore = create(store)

export default useLocoStore
