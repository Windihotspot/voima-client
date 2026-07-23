<template>
  <div class="dash-sidebar mt-6">
    <div class="dash-menu-section">Main Menu</div>

    <ul class="dash-menu">
      <li
        v-for="item in menuItems"
        class="mt-4"
        :key="item.nav"
        :class="{ active: isActive(item) }"
        @click="navigateTo(item)"
      >
        <i :class="item.icon"></i>
        {{ item.label }}
      </li>

      <div class="dash-menu-section mt-6" style="margin-top: 8px">Account</div>

      <template v-for="item in accountItems" :key="item.label">
        <li
          class="mt-4"
          :class="{ active: isActive(item), 'support-open': item.nav === 'support' && supportOpen }"
          @click="navigateTo(item)"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
          <i
            v-if="item.nav === 'support'"
            class="mdi mdi-chevron-down support-chevron"
            :class="{ rotated: supportOpen }"
          ></i>
        </li>

        <!-- Inline submenu for support -->
        <transition name="submenu">
          <div v-if="item.nav === 'support' && supportOpen" class="support-submenu">
            <a
              href="https://wa.me/+2348025253804"
              target="_blank"
              rel="noopener"
              class="submenu-item"
            >
              <span class="submenu-icon wa-icon">
                <i class="mdi mdi-whatsapp"></i>
              </span>
              WhatsApp
            </a>
            <a
              href="mailto:compliance@voimacaas.co.uk?subject=Support Request"
              class="submenu-item"
            >
              <span class="submenu-icon mail-icon">
                <i class="mdi mdi-email-outline"></i>
              </span>
              Email support
            </a>
          </div>
        </transition>
      </template>

      <li @click="signOut">
        <i class="mdi mdi-logout"></i>
        Sign Out
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeNav = ref('home')
const supportOpen = ref(false)

const isActive = (item: { route?: string }) => {
  if (!item.route) return false
  return route.path === item.route || route.path.startsWith(item.route + '/')
}

// Single handler for both main menu and account items.
// If the item is the support toggle, expand/collapse the submenu instead of navigating.
const navigateTo = (item: { nav: string; route?: string }) => {
  if (item.nav === 'support') {
    supportOpen.value = !supportOpen.value
    return
  }

  activeNav.value = item.nav

  if (item.route) {
    router.push(item.route)
  }
}

const signOut = () => {
  router.push('/')
}

const menuItems = [
  {
    nav: 'dashboard',
    label: 'Dashboard',
    icon: 'mdi mdi-view-dashboard-outline',
    route: '/dashboard'
  },
  {
    nav: 'risk',
    label: 'Risk Assessment',
    icon: 'mdi mdi-alert-outline',
    route: '/risks'
  },
  {
    nav: 'gap',
    label: 'Gap Analysis',
    icon: 'mdi mdi-chart-box-outline',
    route: '/gaps'
  },
  {
    nav: 'documents',
    label: 'Documents',
    icon: 'mdi mdi-file-document-outline',
    route: '/documents'
  }
]

const accountItems = [
  {
    nav: 'profile',
    label: 'Profile',
    icon: 'mdi mdi-account-circle-outline',
    route: '/profile'
  },
  {
    nav: 'settings',
    label: 'Settings',
    icon: 'mdi mdi-cog-outline',
    route: '/settings'
  },
  {
    nav: 'support',
    label: 'Support',
    icon: 'mdi mdi-help-circle-outline'
  }
]
</script>

<style scoped>
.dash-sidebar {
  width: 260px;
  padding: 18px;
  background: #ffffff;
  min-height: 100vh;
  border-right: 1px solid #eef0f4;
}

/* SECTION LABEL */
.dash-menu-section {
  font-size: 11px;
  font-weight: 600;
  color: #9aa0a6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 16px 8px 10px;
}

/* MENU LIST */
.dash-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* MENU ITEM */
.dash-menu li {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;

  font-size: 14px;
  color: rgba(15, 23, 42, 0.65);

  transition: all 0.2s ease;
}

.dash-menu li i {
  font-size: 18px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* HOVER */
.dash-menu li:hover {
  background: rgba(37, 99, 235, 0.08);
  color: #1e293b;
}

/* ACTIVE STATE */
.dash-menu li.active {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.dash-menu li.active i {
  color: #fff;
}

/* SUPPORT CHEVRON */
.support-chevron {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.support-chevron.rotated {
  transform: rotate(180deg);
}

.dash-menu li.support-open {
  background: rgba(37, 99, 235, 0.08);
  color: #1e293b;
}

/* SUPPORT SUBMENU */
.support-submenu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 4px 0 4px 12px;
  padding-left: 20px;
  border-left: 2px solid rgba(37, 99, 235, 0.25);
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.65);
  text-decoration: none;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background: rgba(37, 99, 235, 0.08);
  color: #1e293b;
}

.submenu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 13px;
  flex-shrink: 0;
}

.wa-icon {
  background: rgba(135, 240, 205, 0.15);
  color: green;
}

.mail-icon {
  background: rgba(37, 99, 235, 0.15);
  color: #2563eb;
}

/* SUBMENU TRANSITION */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 120px;
}

.mt-4 {
  margin-top: 4px;
}

.mt-6 {
  margin-top: 6px;
}
</style>
