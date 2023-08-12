import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const isRouteAllowed = (to) => {
  const isAllowed = (to.path === '/' || to.path.includes('connect'));
  console.log('isRouteAllowed', isAllowed, to);
  return isAllowed;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/effects',
      name: 'effects',
      component: () => import('../views/EffectsView.vue')
    },
    {
      path: '/throttle/:locoId?',
      name: 'throttle',
      component: () => import('../views/ThrottleView.vue')
    },
    {
      path: '/locos',
      name: 'locos',
      component: () => import('../throttle/SelectLoco.component.vue')
    },
    {
      path: '/turnouts',
      name: 'turnouts',
      component: () => import('../views/TurnoutsView.vue')
    },
    {
      path: '/routes',
      name: 'routes',
      component: () => import('../views/RoutesView.vue')
    },
    {
      path: '/connect/layoutapi',
      name: 'layoutapi',
      component: () => import('../connections/layout-api/LayoutApiConnect.component.vue')
    },
    {
      path: '/connect/layoutId',
      name: 'layoutId',
      component: () => import('../connections/layout-api/SelectLayout.component.vue')
    },
    {
      path: '/connect/dcc-ex',
      name: 'dcc-ex',
      component: () => import('../connections/dcc-ex/DccExConnect.component.vue')
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   if (!isRouteAllowed(to, store)) {
//     console.log('router.beforeEach', to.path, from.path, store.layoutId);
//     // router.replace('/');
//     next({ name: 'home' });
//   } else  if (to.path === '/' && store.layoutId) {
//     next();
//   }
// });

export default router
