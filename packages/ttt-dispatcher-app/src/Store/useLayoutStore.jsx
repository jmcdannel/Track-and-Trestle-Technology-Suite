import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const store = persist((set, get) => ({
  layout: {},
  initLayouts: (layout) => {
    console.log('initLayouts', layout)
    set({ layout })
  }
}), {
  name: '@ttt/layout-store',
  storage: createJSONStorage(() => sessionStorage)
});


export const useLayoutStore = create(store)

export default useLayoutStore
