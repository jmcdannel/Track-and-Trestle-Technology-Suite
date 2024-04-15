import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const store = persist((set, get) => ({
  effects: [],
  updateEffect: (effect) => set(state => ({
    effects: [...state.effects.map(t => {
      if (t.effectId === effect.effectId) {
        return {...t, ...effect}
      }
      return t;
    })]
  })),
  initEffects: (effects) => set({ effects }),
}), {
  name: '@ttt/effect-store',
  storage: createJSONStorage(() => sessionStorage)
});


export const useEffectStore = create(store)

export default useEffectStore
