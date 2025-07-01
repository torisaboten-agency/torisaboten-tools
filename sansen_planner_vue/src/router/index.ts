import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '参战计划作成工具'
      }
    },
    {
      path: '/docs',
      name: 'Documentation',
      component: () => import('@/views/Documentation.vue'),
      meta: {
        title: '用户文档 - 参战计划作成工具'
      }
    },
    {
      path: '/planner/:id',
      name: 'PlannerDetail',
      component: () => import('@/views/PlannerDetail.vue'),
      meta: {
        title: '规划详情'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 路由守卫 - 设置页面标题
router.beforeEach((to) => {
  document.title = (to.meta.title as string) || '参战计划作成工具'
})

export default router 