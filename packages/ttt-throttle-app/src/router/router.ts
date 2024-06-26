import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/throttle/:locoId?',
      name: 'throttle',
      component: () => import('../views/ThrottleView.vue')
    },
    {
      path: '/connect',
      name: 'connect',
      component: () => import('../connections/SelectConnections.component.vue')
    },
    {
      path: '/connect/dcc-ex',
      name: 'dcc-ex',
      component: () => import('../connections/dcc-ex/DccExConnect.component.vue')
    },
    {
      path: '/connect/serial/:connectionId',
      name: 'serial',
      component: () => import('../connections/serial/SerialConnect.component.vue')
    }
  ]
});


export default router
