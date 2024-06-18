import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const persistKeys= ['routes', 'destinations', 'paths'];
const store = persist((set, get) => ({
  routes: [],
  destinations: [],
  paths: [],
  routeDestination: undefined,
  routeOrigin: undefined,
  updateOrigin: (route) => set({ routeOrigin: route }),
  updateDestination: (route) => set({ routeDestination: route }),
  updateRoute: (route) => set(state => ({
    routes: [...state.routes.map(t => {
      if (t.routeId === route.routeId) {
        return {...t, ...route}
      }
      return t;
    })]
  })),
  initRoutes: (routes) => set({ 
    routes, 
    paths: routes?.paths, 
    destinations: routes?.destinations 
  }),
}), {
  name: '@ttt/route-store',
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state) =>
    Object.fromEntries(
      Object.entries(state).filter(([key]) => persistKeys.includes(key)),
    ),
});

export const useRouteStore = create(store)

export default useRouteStore
