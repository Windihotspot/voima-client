<!-- ResetPassword.vue — route: /reset-password (Supabase redirects here with a recovery token in the URL hash, which the SDK auto-exchanges into a session on load) -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  if (newPassword.value.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match'
    return
  }

  saving.value = true
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword.value })
    if (error) throw error
    router.push('/signin')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-24 px-4">
    <h1 class="text-lg font-bold text-slate-900 mb-1">Set a new password</h1>
    <p class="text-sm text-slate-500 mb-5">Choose a new password for your account.</p>

    <input
      v-model="newPassword"
      type="password"
      placeholder="New password"
      class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-2"
    />
    <input
      v-model="confirmPassword"
      type="password"
      placeholder="Confirm new password"
      class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3"
    />
    <p v-if="errorMsg" class="text-xs text-rose-600 mb-3">{{ errorMsg }}</p>
    <button
      @click="submit"
      :disabled="saving"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2 disabled:opacity-50"
    >
      {{ saving ? 'Saving…' : 'Update Password' }}
    </button>
  </div>
</template>
