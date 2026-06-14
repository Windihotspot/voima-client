// stores/applicantAuth.ts
import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

interface ApplicantUser {
  id: string
  email: string
  full_name: string
  application_id: string
}

export const useApplicantAuthStore = defineStore('applicantAuth', {
  state: () => ({
    user: null as ApplicantUser | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async login(email: string, phone: string) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: phone.trim()
        })

        if (error) throw error

        const meta = data.user.user_metadata
        if (meta.portal !== 'onboarding_applicant') {
          await supabase.auth.signOut()
          throw new Error('This account is not registered for the applicant portal.')
        }

        this.user = {
          id: data.user.id,
          email: data.user.email!,
          full_name: meta.full_name,
          application_id: meta.application_id
        }

        return true
      } catch (err: any) {
        this.error = err.message || 'Login failed. Please check your email and phone number.'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },

    async restoreSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        const meta = data.session.user.user_metadata
        if (meta.portal === 'onboarding_applicant') {
          this.user = {
            id: data.session.user.id,
            email: data.session.user.email!,
            full_name: meta.full_name,
            application_id: meta.application_id
          }
        }
      }
    }
  }
})
