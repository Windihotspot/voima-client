<!-- ForgotPassword.vue — route: /forgot-password -->
<script setup>
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

const email = ref('')
const sent = ref(false)
const sending = ref(false)
const errorMsg = ref('')

async function submit() {
  sending.value = true
  errorMsg.value = ''
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    sent.value = true
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-24 px-4">
    <h1 class="text-lg font-bold text-slate-900 mb-1">Reset your password</h1>
    <p class="text-sm text-slate-500 mb-5">Enter your email and we'll send you a reset link.</p>

    <template v-if="!sent">
      <input
        v-model="email"
        type="email"
        placeholder="you@company.com"
        class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3"
      />
      <p v-if="errorMsg" class="text-xs text-rose-600 mb-3">{{ errorMsg }}</p>
      <button
        @click="submit"
        :disabled="sending"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2 disabled:opacity-50"
      >
        {{ sending ? 'Sending…' : 'Send Reset Link' }}
      </button>
    </template>

    <div
      v-else
      class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-4"
    >
      <i class="fa-solid fa-check-circle mr-1"></i>
      Check your inbox at <strong>{{ email }}</strong> for a reset link.
    </div>
  </div>
</template>
