import { createRouter, createWebHistory } from 'vue-router'
import Onboarding from '../views/Onboarding.vue'
import WaitlistPage from '../views/WaitlistPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import ComplianceDashboard from '@/views/ComplianceDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: ComplianceDashboard
    }
  ]
})

export default router
