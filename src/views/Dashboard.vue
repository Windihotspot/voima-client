<!-- views/applicant/ApplicantDashboard.vue -->

<script setup lang="ts">
import { onMounted, computed, ref, watchEffect } from 'vue'
import { useApplicantPortal } from '@/composables/useApplicationPortal'
import { useApplicantAuthStore } from '@/stores/applicationAuth'
import MainLayout from '@/components/Layouts/MainLayout.vue'

const {
  application,
  documents,
  directors,
  loading,
  error,
  fetchMyApplication,
  getDocumentDownloadUrl
} = useApplicantPortal()

const authStore = useApplicantAuthStore()

onMounted(fetchMyApplication)

// ── Safe formatting helper ──────────────────────────────────────────────
function safe(val: string | null | undefined, fallback = '—') {
  if (!val) return fallback
  return val.replace(/_/g, ' ')
}
watchEffect(() => {
  console.log('APPLICATION =>', application.value)
  console.log('DOCUMENTS =>', documents.value)
  console.log('DIRECTORS =>', directors.value)
})
const statusConfig: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  draft: { color: '#64748b', bg: '#f1f5f9', label: 'Draft', icon: 'mdi-pencil-outline' },
  submitted: { color: '#2563eb', bg: '#eff6ff', label: 'Submitted', icon: 'mdi-send-outline' },
  under_review: {
    color: '#b45309',
    bg: '#fef3c7',
    label: 'Under Review',
    icon: 'mdi-magnify-scan'
  },
  approved: {
    color: '#15803d',
    bg: '#dcfce7',
    label: 'Approved',
    icon: 'mdi-check-decagram-outline'
  },
  rejected: {
    color: '#b91c1c',
    bg: '#fee2e2',
    label: 'Rejected',
    icon: 'mdi-close-circle-outline'
  },
  on_hold: { color: '#c2410c', bg: '#ffedd5', label: 'On Hold', icon: 'mdi-pause-circle-outline' }
}

const status = computed(() => {
  if (!application.value) return statusConfig.draft
  return statusConfig[application.value.status] || statusConfig.draft
})

const docTypeLabels: Record<string, string> = {
  certificate_of_incorporation: 'Certificate of Incorporation',
  memorandum_articles: 'Memorandum & Articles of Association',
  board_resolution: 'Board Resolution',
  regulatory_license: 'Regulatory License',
  aml_cft_policy: 'AML/CFT Policy',
  kyc_policy: 'KYC Policy',
  latest_audited_accounts: 'Latest Audited Accounts',
  organizational_chart: 'Organizational Chart',
  shareholder_register: 'Shareholder Register',
  director_id: 'Director ID',
  other: 'Other Document'
}

const docCategory: Record<string, string> = {
  certificate_of_incorporation: 'Corporate',
  memorandum_articles: 'Corporate',
  board_resolution: 'Corporate',
  regulatory_license: 'Regulatory',
  aml_cft_policy: 'Compliance',
  kyc_policy: 'Compliance',
  latest_audited_accounts: 'Financial',
  organizational_chart: 'Corporate',
  shareholder_register: 'Corporate',
  director_id: 'Identification',
  other: 'Other'
}

const docCategoryIcons: Record<string, string> = {
  Corporate: 'mdi-domain',
  Regulatory: 'mdi-gavel',
  Compliance: 'mdi-shield-check-outline',
  Financial: 'mdi-chart-line',
  Identification: 'mdi-card-account-details-outline',
  Other: 'mdi-file-outline'
}

// ── Documents table ────────────────────────────────────────────────────
const docSearch = ref('')
const docPage = ref(1)
const docsPerPage = 6

const safeDocuments = computed(() => documents.value || [])

const filteredDocs = computed(() => {
  const list = safeDocuments.value
  if (!docSearch.value.trim()) return list
  const q = docSearch.value.toLowerCase()
  return list.filter(
    (d) =>
      (docTypeLabels[d.doc_type] || d.doc_type || '').toLowerCase().includes(q) ||
      (d.file_name || '').toLowerCase().includes(q)
  )
})

const docTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredDocs.value.length / docsPerPage))
)

const paginatedDocs = computed(() => {
  const start = (docPage.value - 1) * docsPerPage
  return filteredDocs.value.slice(start, start + docsPerPage)
})

const confirmedDocsCount = computed(() => safeDocuments.value.filter((d) => d.is_confirmed).length)

// ── Directors table ────────────────────────────────────────────────────
const dirSearch = ref('')
const dirPage = ref(1)
const dirsPerPage = 6

const safeDirectors = computed(() => directors.value || [])

const filteredDirectors = computed(() => {
  const list = safeDirectors.value
  if (!dirSearch.value.trim()) return list
  const q = dirSearch.value.toLowerCase()
  return list.filter((d) => (d.full_name || '').toLowerCase().includes(q))
})

const dirTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredDirectors.value.length / dirsPerPage))
)

const paginatedDirectors = computed(() => {
  const start = (dirPage.value - 1) * dirsPerPage
  return filteredDirectors.value.slice(start, start + dirsPerPage)
})

const uboCount = computed(() => safeDirectors.value.filter((d) => d.is_ubo).length)

function formatDate(date: string | null | undefined) {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatFileSize(bytes: number | null | undefined) {
  if (!bytes) return '—'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function initials(name: string | null | undefined) {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

async function downloadDoc(filePath: string | null, fileName: string) {
  if (!filePath) return
  try {
    const url = await getDocumentDownloadUrl(filePath)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    link.click()
  } catch (e) {
    console.error('Download failed', e)
  }
}

async function handleLogout() {
  await authStore.logout()
  window.location.href = '/'
}
</script>

<template>
  <MainLayout>
    <div class="portal-screen">
      <!-- Top bar -->
      <header class="portal-topbar">
        <div class="portal-topbar-inner">
          <div class="flex items-center gap-2">
            <v-icon icon="mdi-orbit-variant" size="24" color="#2563eb" />
            <span class="portal-brand">Voima Client Portal</span>
          </div>
          <v-btn variant="outlined" size="small" class="logout-btn" @click="handleLogout">
            <v-icon start icon="mdi-logout" size="16" />
            Sign Out
          </v-btn>
        </div>
      </header>

      <main class="portal-main">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <v-progress-circular indeterminate color="#2563eb" size="40" />
        </div>

        <!-- Error -->
        <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
          {{ error }}
        </v-alert>

        <template v-else-if="application">
          <!-- Page header card -->
          <div class="page-header-card">
            <div class="page-header-left">
              <div class="page-header-icon">
                <v-icon icon="mdi-briefcase-outline" size="22" color="#2563eb" />
              </div>
              <div>
                <h1 class="page-title">{{ application.company_name || 'Untitled Application' }}</h1>
                <p class="page-subtitle">
                  <strong>{{ application.contact_email || '-' }}</strong>
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- No application -->
        <v-alert v-else type="info" variant="tonal">
          No application found for this account.
        </v-alert>
      </main>
    </div>
  </MainLayout>
</template>

<style scoped>
.portal-screen {
  min-height: 100vh;
  background: #f1f5f9;
}

/* Top bar */
.portal-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.portal-topbar-inner {
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.portal-brand {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.logout-btn {
  border-color: #e2e8f0 !important;
  color: #475569 !important;
  text-transform: none;
  font-weight: 500;
}

/* Main */
.portal-main {
  margin: 0 auto;
  padding: 1.5rem;
}

/* Page header card */
.page-header-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  border: 1px solid #e2e8f0;
}

.page-header-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.page-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.page-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.125rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.status-pill-sm {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Stat grid */
.stat-grid {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.125rem;
}

/* Section cards */
.section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.mt-6 {
  margin-top: 1.5rem;
}

.section-card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-card-header-row {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
}

.section-card-body {
  padding: 1.25rem;
}

.count-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}

.count-badge-accent {
  color: #15803d;
  background: #dcfce7;
}

.count-badge-success {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #15803d;
  background: #dcfce7;
}

/* Info grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 1.5rem;
}

.info-item-full {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
  margin-top: 0.125rem;
}

.info-link {
  font-size: 0.875rem;
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
}

.info-link:hover {
  text-decoration: underline;
}

/* Search box */
.table-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  min-width: 220px;
}

.table-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.8125rem;
  color: #334155;
  width: 100%;
}

.table-search input::placeholder {
  color: #94a3b8;
}

/* Table */
.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.data-table tbody td {
  padding: 0.875rem 1.25rem;
  font-size: 0.8125rem;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.cell-strong {
  font-weight: 600;
  color: #1e293b;
}

.cell-link {
  color: #2563eb;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #475569;
}

.avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
}

.action-icons {
  display: flex;
  gap: 0.625rem;
}

/* Pagination */
.table-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border-top: 1px solid #f1f5f9;
}

.page-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: #f1f5f9;
}

.page-info {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

/* Chips */
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  text-transform: capitalize;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2.5rem 1rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
