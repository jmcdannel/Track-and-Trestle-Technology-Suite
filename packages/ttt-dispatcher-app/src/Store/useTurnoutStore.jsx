import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const store = persist((set, get) => ({
  turnouts: [],
  updateTurnout: (turnout) => set(state => ({
    turnouts: [...state.turnouts.map(t => {
      if (t.turnoutId === turnout.turnoutId) {
        return {...t, ...turnout}
      }
      return t;
    })]
  })),
  initTurnouts: (turnouts) => set({ turnouts }),
}), {
  name: '@ttt/turnout-store',
  storage: createJSONStorage(() => sessionStorage)
});


export const useTurnoutStore = create(store)

export default useTurnoutStore
