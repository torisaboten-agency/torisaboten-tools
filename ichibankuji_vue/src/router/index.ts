import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/config/:id?',
      name: 'config',
      component: () => import('@/views/LotteryConfig.vue'),
      props: true
    },
    {
      path: '/draw/:id',
      name: 'draw',
      component: () => import('@/views/LotteryDraw.vue'),
      props: true
    },
    {
      path: '/docs',
      name: 'documentation',
      component: () => import('@/views/Documentation.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router 