<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/images/new-logo.jpeg'
const router = useRouter()

const goHome = () => {
  router.push('/')
}

const activeSection = ref('home')

const sections = ['home', 'features', 'loan-types', 'faq']

let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.6 }
  )

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <header class="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
      <!-- Logo -->
      <div @click="goHome" class="flex items-center gap-2">
        <img :src="logo" alt="" class="h-10" />
      </div>

      <!-- Nav links -->
      <nav class="hidden md:flex items-center gap-8 text-md">
        <a
          href="#features"
          :class="
            activeSection === 'features'
              ? 'text-purple-600 font-semibold'
              : 'text-gray-600 hover:text-purple-600'
          "
        >
          Features
        </a>

        <a
          href="#loan-types"
          :class="
            activeSection === 'loan-types'
              ? 'text-purple-600 font-semibold'
              : 'text-gray-600 hover:text-purple-600'
          "
        >
          Loan Types
        </a>

        <a
          href="#faq"
          :class="
            activeSection === 'faq'
              ? 'text-purple-600 font-semibold'
              : 'text-gray-600 hover:text-purple-600'
          "
        >
          FAQ
        </a>
      </nav>

      <!-- Auth -->
      <div class="flex items-center gap-6">
        <router-link to="/login">
          <a href="#" class="text-sm text-gray-600 hover:text-purple-600">Sign in</a>
        </router-link>

        <v-btn to="/signup" class="text-white normal-case custom-btn" elevation="0">
          Get Started
        </v-btn>
      </div>
    </div>
  </header>
</template>

<style scoped>
.v-btn {
  background-color: #5c2ecd;
  text-transform: none;
}
</style>
