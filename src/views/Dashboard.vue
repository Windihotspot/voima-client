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
                  Reference: <strong>{{ application.reference_number || 'Pending' }}</strong>
                </p>
              </div>
            </div>
            <div class="status-pill" :style="{ background: status.bg, color: status.color }">
              <v-icon :icon="status.icon" size="15" :color="status.color" />
              {{ status.label }}
            </div>
          </div>

          <!-- Stat grid -->
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-icon" style="background: #eff6ff">
                <v-icon icon="mdi-file-document-multiple-outline" color="#2563eb" size="20" />
              </div>
              <div>
                <p class="stat-value">{{ documents.length }}</p>
                <p class="stat-label">Documents Submitted</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: #f0fdf4">
                <v-icon icon="mdi-account-group-outline" color="#16a34a" size="20" />
              </div>
              <div>
                <p class="stat-value">{{ directors.length }}</p>
                <p class="stat-label">Directors / UBOs</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: #fef3c7">
                <v-icon icon="mdi-calendar-check-outline" color="#b45309" size="20" />
              </div>
              <div>
                <p class="stat-value">{{ formatDate(application.submitted_at) }}</p>
                <p class="stat-label">Date Submitted</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: #fce7f3">
                <v-icon icon="mdi-shield-check-outline" color="#be185d" size="20" />
              </div>
              <div>
                <p class="stat-value capitalize">
                  {{
                    application.organisation_type
                      ? application.organisation_type.replace(/_/g, ' ')
                      : '—'
                  }}
                </p>
                <p class="stat-label">Organisation Type</p>
              </div>
            </div>
          </div>

          <!-- ===================== PRIMARY CONTACT ===================== -->
          <div class="section-card mt-6">
            <div class="section-card-header">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-card-account-details-outline" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Primary Contact</h2>
              </div>
            </div>
            <div class="section-card-body">
              <div class="info-grid">
                <div class="info-item">
                  <p class="info-label">Full Name</p>
                  <p class="info-value">{{ application.contact_full_name || '—' }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Job Title</p>
                  <p class="info-value">{{ application.contact_job_title || '—' }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Email</p>
                  <p class="info-value">{{ application.contact_email || '—' }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Phone</p>
                  <p class="info-value">{{ application.contact_phone || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviewer Notes -->
          <div v-if="application.review_notes" class="section-card mt-6">
            <div class="section-card-header">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-message-text-outline" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Reviewer Notes</h2>
              </div>
            </div>
            <div class="section-card-body">
              <p class="info-value">{{ application.review_notes }}</p>
            </div>
          </div>

          <!-- ===================== COMPANY INFORMATION ===================== -->
          <div class="section-card mt-6">
            <div class="section-card-header">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-domain" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Company Information</h2>
              </div>
            </div>
            <div class="section-card-body">
              <div class="info-grid">
                <div class="info-item">
                  <p class="info-label">Legal Company Name</p>
                  <p class="info-value">{{ application.company_name || '—' }}</p>
                </div>
                <div class="info-item" v-if="application.trading_name">
                  <p class="info-label">Trading Name</p>
                  <p class="info-value">{{ application.trading_name }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Organisation Type</p>
                  <p class="info-value capitalize">
                    {{
                      application.organisation_type
                        ? application.organisation_type.replace(/_/g, ' ')
                        : '—'
                    }}
                  </p>
                </div>
                <div class="info-item">
                  <p class="info-label">Registration Number</p>
                  <p class="info-value">{{ application.registration_number || '—' }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Registration Country</p>
                  <p class="info-value">{{ application.registration_country || '—' }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Date of Incorporation</p>
                  <p class="info-value">{{ formatDate(application.date_of_incorporation) }}</p>
                </div>
                <div class="info-item" v-if="application.website">
                  <p class="info-label">Website</p>
                  <a :href="application.website" target="_blank" class="info-link">{{
                    application.website
                  }}</a>
                </div>
                <div class="info-item info-item-full" v-if="application.industry_description">
                  <p class="info-label">Industry Description</p>
                  <p class="info-value">{{ application.industry_description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Regulatory Information -->
          <div class="section-card mt-6">
            <div class="section-card-header">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-gavel" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Regulatory Information</h2>
              </div>
            </div>
            <div class="section-card-body">
              <div class="info-grid">
                <div class="info-item">
                  <p class="info-label">Regulated Entity</p>
                  <span
                    class="status-pill-sm"
                    :style="
                      application.is_regulated
                        ? { background: '#dcfce7', color: '#15803d' }
                        : { background: '#f1f5f9', color: '#64748b' }
                    "
                  >
                    {{ application.is_regulated ? 'Yes' : 'No' }}
                  </span>
                </div>
                <template v-if="application.is_regulated">
                  <div class="info-item">
                    <p class="info-label">Regulator</p>
                    <p class="info-value">{{ application.regulator_name || '—' }}</p>
                  </div>
                  <div class="info-item">
                    <p class="info-label">License Number</p>
                    <p class="info-value">{{ application.regulatory_license_number || '—' }}</p>
                  </div>
                  <div class="info-item">
                    <p class="info-label">License Expiry</p>
                    <p class="info-value">{{ formatDate(application.license_expiry_date) }}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="section-card mt-6">
            <div class="section-card-header">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-map-marker-outline" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Address</h2>
              </div>
            </div>
            <div class="section-card-body">
              <div class="info-grid">
                <div class="info-item info-item-full" v-if="application.registered_address">
                  <p class="info-label">Registered Address</p>
                  <p class="info-value">{{ application.registered_address }}</p>
                </div>
                <div class="info-item info-item-full" v-if="application.operating_address">
                  <p class="info-label">Operating Address</p>
                  <p class="info-value">{{ application.operating_address }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">City</p>
                  <p class="info-value">{{ application.city || '—' }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Country</p>
                  <p class="info-value">{{ application.country || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ===================== DIRECTORS & UBOS ===================== -->
          <div class="section-card mt-6">
            <div class="section-card-header-row">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #f0fdf4">
                  <v-icon icon="mdi-account-group-outline" size="18" color="#16a34a" />
                </div>
                <h2 class="section-title">Directors & Beneficial Owners</h2>
                <span class="count-badge">{{ directors.length }}</span>
                <span v-if="uboCount" class="count-badge count-badge-accent">
                  {{ uboCount }} UBO{{ uboCount > 1 ? 's' : '' }}
                </span>
              </div>
              <div class="table-search">
                <v-icon icon="mdi-magnify" size="16" color="#94a3b8" />
                <input
                  v-model="dirSearch"
                  type="text"
                  id="director-search"
                  name="director-search"
                  placeholder="Search name..."
                  autocomplete="off"
                />
              </div>
            </div>

            <div v-if="!filteredDirectors.length" class="empty-state">
              <v-icon icon="mdi-account-multiple-outline" size="32" color="#cbd5e1" />
              <p>No directors or UBOs found.</p>
            </div>

            <div v-else class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Nationality</th>
                    <th>ID Type</th>
                    <th>ID Number</th>
                    <th>UBO</th>
                    <th>Ownership %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dir in paginatedDirectors" :key="dir.id">
                    <td>
                      <div class="avatar-circle">{{ initials(dir.full_name) }}</div>
                    </td>
                    <td class="cell-strong">{{ dir.full_name || '—' }}</td>
                    <td>{{ dir.job_title || '—' }}</td>
                    <td>{{ dir.nationality || '—' }}</td>
                    <td>{{ dir.id_type || '—' }}</td>
                    <td>{{ dir.id_number || '—' }}</td>
                    <td>
                      <span
                        class="status-pill-sm"
                        :style="
                          dir.is_ubo
                            ? { background: '#dcfce7', color: '#15803d' }
                            : { background: '#f1f5f9', color: '#64748b' }
                        "
                      >
                        {{ dir.is_ubo ? 'Yes' : 'No' }}
                      </span>
                    </td>
                    <td>{{ dir.ownership_percent ?? '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="table-pagination" v-if="filteredDirectors.length > dirsPerPage">
              <button class="page-btn" :disabled="dirPage === 1" @click="dirPage--">
                <v-icon icon="mdi-chevron-left" size="16" />
              </button>
              <span class="page-info">Page {{ dirPage }} of {{ dirTotalPages }}</span>
              <button class="page-btn" :disabled="dirPage === dirTotalPages" @click="dirPage++">
                <v-icon icon="mdi-chevron-right" size="16" />
              </button>
            </div>
          </div>

          <!-- ===================== DOCUMENTS ===================== -->
          <div class="section-card mt-6">
            <div class="section-card-header-row">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-file-document-multiple-outline" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Submitted Documents</h2>
                <span class="count-badge">{{ documents.length }}</span>
                <span v-if="confirmedDocsCount" class="count-badge count-badge-success">
                  <v-icon icon="mdi-check-circle" size="12" />
                  {{ confirmedDocsCount }} confirmed
                </span>
              </div>
              <div class="table-search">
                <v-icon icon="mdi-magnify" size="16" color="#94a3b8" />
                <input
                  v-model="docSearch"
                  type="text"
                  id="document-search"
                  name="document-search"
                  placeholder="Search title, type..."
                  autocomplete="off"
                />
              </div>
            </div>

            <div v-if="!filteredDocs.length" class="empty-state">
              <v-icon icon="mdi-file-document-outline" size="32" color="#cbd5e1" />
              <p>No documents found.</p>
            </div>

            <div v-else class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Category</th>
                    <th>File Name</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doc in paginatedDocs" :key="doc.id">
                    <td class="cell-strong cell-link">
                      {{ docTypeLabels[doc.doc_type] || doc.doc_type }}
                    </td>
                    <td>
                      <span class="category-pill">
                        <v-icon
                          :icon="docCategoryIcons[docCategory[doc.doc_type]] || 'mdi-file-outline'"
                          size="13"
                          color="#64748b"
                        />
                        {{ docCategory[doc.doc_type] || 'Other' }}
                      </span>
                    </td>
                    <td>{{ doc.file_name || '—' }}</td>
                    <td>{{ formatFileSize(doc.file_size) }}</td>
                    <td>{{ formatDate(doc.uploaded_at) }}</td>
                    <td>
                      <span
                        class="status-pill-sm"
                        :style="
                          doc.is_confirmed
                            ? { background: '#dcfce7', color: '#15803d' }
                            : { background: '#fef3c7', color: '#b45309' }
                        "
                      >
                        {{ doc.is_confirmed ? 'Confirmed' : 'Pending' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-icons">
                        <v-icon
                          icon="mdi-download-outline"
                          size="18"
                          color="#2563eb"
                          class="cursor-pointer"
                          @click="downloadDoc(doc.file_path, doc.file_name)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="table-pagination" v-if="filteredDocs.length > docsPerPage">
              <button class="page-btn" :disabled="docPage === 1" @click="docPage--">
                <v-icon icon="mdi-chevron-left" size="16" />
              </button>
              <span class="page-info">Page {{ docPage }} of {{ docTotalPages }}</span>
              <button class="page-btn" :disabled="docPage === docTotalPages" @click="docPage++">
                <v-icon icon="mdi-chevron-right" size="16" />
              </button>
            </div>
          </div>

          <!-- ===================== SERVICE & COMPLIANCE ===================== -->
          <div class="section-card mt-6">
            <div class="section-card-header">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-handshake-outline" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Service Interest</h2>
              </div>
            </div>
            <div class="section-card-body">
              <div class="info-item mb-4" v-if="application.service_package">
                <p class="info-label">Service Package</p>
                <span class="status-pill-sm" style="background: #eff6ff; color: #2563eb">
                  {{
                    application.service_package
                      ? application.service_package.replace(/_/g, ' ')
                      : '—'
                  }}
                </span>
              </div>
              <div class="info-item mb-4" v-if="application.service_interest?.length">
                <p class="info-label mb-2">Areas of Interest</p>
                <div class="chip-row">
                  <span
                    v-for="interest in application.service_interest"
                    :key="interest"
                    class="chip"
                  >
                    <v-icon icon="mdi-tag-outline" size="12" color="#64748b" />
                    {{ interest ? interest.replace(/_/g, ' ') : '—' }}
                  </span>
                </div>
              </div>
              <div class="info-item" v-if="application.description_of_needs">
                <p class="info-label">Description of Needs</p>
                <p class="info-value">{{ application.description_of_needs }}</p>
              </div>
              <div
                v-if="
                  !application.service_package &&
                  !application.service_interest?.length &&
                  !application.description_of_needs
                "
                class="empty-state"
              >
                <v-icon icon="mdi-handshake-outline" size="32" color="#cbd5e1" />
                <p>No service interest information provided.</p>
              </div>
            </div>
          </div>

          <!-- Compliance Context -->
          <div class="section-card mt-6">
            <div class="section-card-header">
              <div class="flex items-center gap-2">
                <div class="section-icon" style="background: #eff6ff">
                  <v-icon icon="mdi-shield-check-outline" size="18" color="#2563eb" />
                </div>
                <h2 class="section-title">Compliance Context</h2>
              </div>
            </div>
            <div class="section-card-body">
              <div class="info-grid">
                <div class="info-item">
                  <p class="info-label">Existing Compliance Program</p>
                  <span
                    class="status-pill-sm"
                    :style="
                      application.has_existing_compliance_program
                        ? { background: '#dcfce7', color: '#15803d' }
                        : { background: '#f1f5f9', color: '#64748b' }
                    "
                  >
                    {{ application.has_existing_compliance_program ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="info-item">
                  <p class="info-label">Estimated Monthly Transactions</p>
                  <p class="info-value">
                    {{ application.estimated_monthly_transactions || '—' }}
                  </p>
                </div>
                <div class="info-item info-item-full" v-if="application.existing_compliance_notes">
                  <p class="info-label">Compliance Notes</p>
                  <p class="info-value">{{ application.existing_compliance_notes }}</p>
                </div>
                <div class="info-item info-item-full" v-if="application.customer_base_description">
                  <p class="info-label">Customer Base Description</p>
                  <p class="info-value">{{ application.customer_base_description }}</p>
                </div>
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
