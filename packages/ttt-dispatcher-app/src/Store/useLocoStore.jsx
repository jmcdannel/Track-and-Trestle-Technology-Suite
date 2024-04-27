import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const store = persist((set, get) => ({
  locos: [],
  updateLoco: (loco) => set(state => ({
    locos: [...state.locos.map(t => {
      if (t.address === loco.address) {
        return {...t, ...loco}
      }
      return t;
    })]
  })),
  initLocos: (locos, throttles) => {
    let throttleCount = 0;
    const locosWithThrottles = locos.map(loco => {
      const throttle = throttles.find(t => t.address === loco.address);
      !!throttle && throttleCount++;
      console.log('initLocos', loco, throttle, throttleCount)
      return { 
        ...loco, 
        isAcquired: !!throttle && throttle.speed > 0,
        cruiseControl: throttleCount > 2
      };
    });
    set({ locos: locosWithThrottles })
  },
}), {
  name: '@ttt/loco-store',
  storage: createJSONStorage(() => sessionStorage)
});


export const useLocoStore = create(store)

export default useLocoStore
