import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const store = persist((set, get) => ({
  throttles: [],
  getThrottle: (address) => get().throttles.find(t => t.address === address),
  upsertThrottle: (throttle) => {
    const existing = get().throttles.find(t => t.address === throttle.address);
    if (existing) {
      set(state => ({
        throttles: [...state.throttles.map(t => {
          if (t.address === throttle.address) {
            return { ...t, ...throttle };
          }
          return t;
        })]
      }));
    } else {
      set(state => ({ throttles: [...state.throttles, throttle] }));
    }
  },
  addThrottle: (throttle) => set(state => ({ throttles: [...state.throttles, throttle] })),
  updateThrottle: (throttle) => set(state => ({
    throttles: [...state.throttles.map(t => {
      if (t.address === throttle.address) {
        return throttle;
      }
      return t;
    })]
  })), 
}), {
  name: '@ttt/throttle-store',
  storage: createJSONStorage(() => sessionStorage)
});

export const useThrottleStore = create(store)

export default useThrottleStore
