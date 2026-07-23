import { createRouter, createWebHistory } from 'vue-router'
import Onboarding from '../views/Onboarding.vue'
import WaitlistPage from '../views/WaitlistPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import ComplianceDashboard from '@/views/ComplianceDashboard.vue'
import ComplianceGaps from '@/views/ComplianceGaps.vue'
import GapAnalysis from '@/views/GapAnalysis.vue'
import RiskAssessment from '@/views/RiskAssessment.vue'
import Documents from '@/views/Documents.vue'
import Profile from '@/views/Profile.vue'
import AccountSettings from '@/views/AccountSettings.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'

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
    },
    {
      path: '/documents',
      name: 'documents',
      component: Documents
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/settings',
      name: 'settings',
      component: AccountSettings
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword
    }
  ]
})

export default router
