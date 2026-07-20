import { createRouter, createWebHistory } from 'vue-router'
import Onboarding from '../views/Onboarding.vue'
import WaitlistPage from '../views/WaitlistPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import ComplianceDashboard from '@/views/ComplianceDashboard.vue'
import ComplianceGaps from '@/views/ComplianceGaps.vue'
import GapAnalysis from '@/views/GapAnalysis.vue'
import RiskAssessment from '@/views/RiskAssessment.vue'

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
    },
    {
      path: '/gaps',
      name: 'gaps',
      component: GapAnalysis
    },
    {
      path: '/risks',
      name: 'risks',
      component: RiskAssessment
    }
  ]
})

export default router
