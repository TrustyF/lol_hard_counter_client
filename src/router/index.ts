import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import FunnyStats from '@/pages/FunnyStats.vue'
import MatchHistory from '@/pages/MatchHistory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/funnyStats',
      name: 'funny stats',
      component: () => import('@/pages/FunnyStats.vue')
    },
    {
      path: '/matchHistory',
      name: 'match history',
      component: () => import('@/pages/MatchHistory.vue')
    },
  ]
})

export default router
