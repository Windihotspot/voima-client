<template>
  <header
    class="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between"
  >
    <!-- LOGO -->
    <div class="flex items-center cursor-pointer select-none" @click="goLanding">
      <img src="" class="w-30 h-20" alt="" />
    </div>

    <!-- TOP NAV -->

    <!-- RIGHT SECTION -->
    <div class="flex items-center gap-5">
      <!-- NOTIFICATION -->
      <div class="relative cursor-pointer text-[#3d3870] hover:text-[#5C2ECD] transition">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <!-- BADGE -->
        <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-100 rounded-full"></span>
      </div>

      <!-- USER PILL -->
      <div
        class="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition"
      >
        <div class="text-right leading-tight hidden sm:block">
          <div class="text-sm font-semibold text-[#1a1535]">Paratus</div>
        </div>

        <!-- AVATAR -->
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-br from-bg-blue-300 to-bg-blue-500 text-white flex items-center justify-center font-bold text-xs"
        >
          p
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useRouter } from 'vue-router'

const showMenu = ref(false)
const router = useRouter()

import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'dashboard', label: 'Dashboard', route: '/dashboard' },
  { name: 'loan', label: 'Apply for Loan', route: '/loan' },
  { name: 'repayments', label: 'Repayments', route: '/repayment' }
]
const isActive = (item) => {
  return route.path.startsWith(item.route)
}
const goHome = () => {
  router.push('/dashboard')
}

const goLanding = () => {
  // replace with router push if needed
  window.location.href = '/'
}
</script>
