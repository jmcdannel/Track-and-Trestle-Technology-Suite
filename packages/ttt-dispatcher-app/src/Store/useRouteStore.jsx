import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const store = persist((set, get) => ({
  routes: [],
  updateRoute: (route) => set(state => ({
    routes: [...state.routes.map(t => {
      if (t.routeId === route.routeId) {
        return {...t, ...route}
      }
      return t;
    })]
  })),
  initRoutes: (routes) => set({ routes }),
}), {
  name: '@ttt/route-store',
  storage: createJSONStorage(() => sessionStorage)
});


export const useRouteStore = create(store)

export default useRouteStore
