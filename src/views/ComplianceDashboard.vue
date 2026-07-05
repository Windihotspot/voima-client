<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import { supabase } from '@/services/supabase'
import { useApplicantAuthStore } from '@/stores/applicationAuth'
import MainLayout from '@/components/Layouts/MainLayout.vue'

const router = useRouter()
const authStore = useApplicantAuthStore()

// ── State ──────────────────────────────────────────────────────────────
const loading = ref(true)
const error = ref<string | null>(null)
const dashboard = ref<any>(null)
const applicationId = authStore.user?.application_id
const liveUpdateBanner = ref(false)
const uploadingGapId = ref<string | null>(null)
let realtimeChannel: any = null

// ── Load ───────────────────────────────────────────────────────────────
const loadDashboard = async () => {
  loading.value = true
  error.value = null
  try {
    const clientId = authStore.user?.client_id
    const { data, error: rpcErr } = await supabase.rpc(
      'get_compliance_health_dashboard_client_v6',
      { p_client_id: clientId }
    )
    if (rpcErr) throw rpcErr
    dashboard.value = data
  } catch (e: any) {
    error.value = e.message || 'Failed to load compliance data.'
  } finally {
    loading.value = false
  }
}

// ── Realtime ───────────────────────────────────────────────────────────
const subscribeToChanges = () => {
  const assessmentId = dashboard.value?.assessment_id
  if (!assessmentId) return

  realtimeChannel = supabase
    .channel(`client-dashboard-${assessmentId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'compliance_assessments',
        filter: `id=eq.${assessmentId}`
      },
      () => {
        liveUpdateBanner.value = true
        loadDashboard()
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'assessment_module_scores',
        filter: `assessment_id=eq.${assessmentId}`
      },
      () => {
        liveUpdateBanner.value = true
        loadDashboard()
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'compliance_gaps',
        filter: `assessment_id=eq.${assessmentId}`
      },
      () => {
        liveUpdateBanner.value = true
        loadDashboard()
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'assessment_module_reviews',
        filter: `assessment_id=eq.${assessmentId}`
      },
      () => {
        liveUpdateBanner.value = true
        loadDashboard()
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'assessment_evidence_requests',
        filter: `assessment_id=eq.${assessmentId}`
      },
      (payload: any) => {
        liveUpdateBanner.value = true
        if (payload.eventType === 'UPDATE' && payload.new?.status === 'requested') {
          showSnack('New evidence request from your consultant')
        }
        loadDashboard()
      }
    )
    .subscribe()
}

watch(liveUpdateBanner, (val) => {
  if (val) setTimeout(() => (liveUpdateBanner.value = false), 4000)
})

onMounted(async () => {
  await authStore.restoreSession()
  await loadDashboard()
  subscribeToChanges()
})

onUnmounted(() => {
  if (realtimeChannel) supabase.removeChannel(realtimeChannel)
})

// ── Snackbar ───────────────────────────────────────────────────────────
const snack = reactive({ show: false, message: '' })
const showSnack = (message: string) => {
  snack.message = message
  snack.show = true
}

// ── Evidence upload ────────────────────────────────────────────────────
const uploadEvidence = async (gap: any, file: File) => {
  if (!file) return
  uploadingGapId.value = gap.id
  try {
    const clientId = authStore.user?.client_id
    const assessmentId = dashboard.value.assessment_id
    const path = `${clientId}/${assessmentId}/${gap.question_id}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('assessment-evidence')
      .upload(path, file, { contentType: file.type })
    if (uploadError) throw uploadError

    const { error: rpcError } = await supabase.rpc('client_submit_evidence', {
      p_assessment_id: assessmentId,
      p_question_id: gap.question_id,
      p_file_path: path,
      p_file_name: file.name,
      p_file_size: file.size,
      p_mime_type: file.type
    })
    if (rpcError) throw rpcError

    showSnack('Evidence uploaded')
    await loadDashboard()
  } catch (e: any) {
    showSnack('Upload failed: ' + e.message)
  } finally {
    uploadingGapId.value = null
  }
}

const evidenceStatusLabel = (status?: string) =>
  ({
    requested: 'Evidence requested',
    submitted: 'Under review',
    approved: 'Approved',
    rejected: 'Needs resubmission'
  })[status ?? ''] || ''

const evidenceStatusClass = (status?: string) =>
  ({
    requested: 'gap-ev-requested',
    submitted: 'gap-ev-submitted',
    approved: 'gap-ev-approved',
    rejected: 'gap-ev-rejected'
  })[status ?? ''] || ''

// ── Derived data ────────────────────────────────────────────────────────
const hasAssessment = computed(() => dashboard.value?.has_assessment === true)
const healthScore = computed(() => Math.round(dashboard.value?.health_score ?? 0))
const healthRating = computed(() => dashboard.value?.health_rating ?? 'needs_improvement')
const moduleScores = computed<any[]>(() => dashboard.value?.module_scores ?? [])
const gapSummary = computed(() => dashboard.value?.gap_summary ?? {})
const responseStats = computed(() => dashboard.value?.response_stats ?? {})
const gaps = computed<any[]>(() => dashboard.value?.gaps ?? [])
const assessmentStatus = computed(() => dashboard.value?.status ?? 'not_started')
const assessmentRef = computed(() => dashboard.value?.assessment_ref ?? '')

// ── Rating config ───────────────────────────────────────────────────────
const ratingConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  excellent: { label: 'Excellent', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  healthy: { label: 'Healthy', color: '#65a30d', bg: '#f7fee7', border: '#d9f99d' },
  satisfactory: { label: 'Satisfactory', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  needs_improvement: {
    label: 'Needs Improvement',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa'
  },
  at_risk: { label: 'At Risk', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  critical: { label: 'Critical', color: '#991b1b', bg: '#fef2f2', border: '#fca5a5' }
}
const rating = computed(() => ratingConfig[healthRating.value] ?? ratingConfig.needs_improvement)

const gaugeColor = computed(() => {
  const s = healthScore.value
  if (s >= 90) return '#16a34a'
  if (s >= 75) return '#65a30d'
  if (s >= 60) return '#d97706'
  if (s >= 45) return '#ea580c'
  if (s >= 30) return '#dc2626'
  return '#991b1b'
})

const riskColor = (r: string) =>
  ({ critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#65a30d' })[r] || '#94a3b8'

// (radialOptions, moduleBarOptions, gapDonutOptions, responseDonutOptions, radarOptions — unchanged from before)
const radialOptions = computed(() => ({
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: { size: '62%' },
      track: { background: '#e2e8f0', strokeWidth: '100%' },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '36px',
          fontWeight: 800,
          fontFamily: 'Inter, sans-serif',
          color: gaugeColor.value,
          formatter: (val: number) => `${Math.round(val)}`
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      gradientToColors: [gaugeColor.value],
      stops: [0, 100]
    }
  },
  colors: [gaugeColor.value],
  stroke: { lineCap: 'round' },
  labels: ['Health Score']
}))
const radialSeries = computed(() => [healthScore.value])

const moduleBarOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      distributed: true,
      barHeight: '62%',
      dataLabels: { position: 'right' }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Math.round(val)}%`,
    style: { fontSize: '11px', fontWeight: 700, colors: ['#334155'] },
    offsetX: 8
  },
  colors: moduleScores.value.map((m: any) => {
    const s = m.module_score
    if (s >= 90) return '#16a34a'
    if (s >= 75) return '#65a30d'
    if (s >= 60) return '#f59e0b'
    if (s >= 40) return '#ea580c'
    return '#dc2626'
  }),
  xaxis: {
    categories: moduleScores.value.map((m: any) => m.module_name),
    max: 100,
    labels: {
      formatter: (val: number) => `${val}%`,
      style: { fontSize: '11px', colors: '#94a3b8' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { style: { fontSize: '12px', fontWeight: 500, colors: '#334155' }, maxWidth: 160 }
  },
  grid: {
    borderColor: '#f1f5f9',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } }
  },
  legend: { show: false },
  tooltip: { y: { formatter: (val: number) => `${Math.round(val)}%` } }
}))
const moduleBarSeries = computed(() => [
  {
    name: 'Compliance Score',
    data: moduleScores.value.map((m: any) => Math.round(m.module_score ?? 0))
  }
])

const gapDonutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
  labels: ['Critical', 'High', 'Medium', 'Low'],
  colors: ['#dc2626', '#ea580c', '#f59e0b', '#84cc16'],
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Open Gaps',
            fontSize: '12px',
            color: '#64748b',
            fontFamily: 'Inter, sans-serif',
            formatter: () => String(gapSummary.value.open ?? 0)
          },
          value: {
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            color: '#0f172a'
          }
        }
      }
    }
  },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    markers: { width: 8, height: 8, radius: 99 }
  },
  stroke: { width: 2, colors: ['#ffffff'] },
  tooltip: { y: { formatter: (val: number) => `${val} gap${val !== 1 ? 's' : ''}` } }
}))
const gapDonutSeries = computed(() => [
  gapSummary.value.critical ?? 0,
  gapSummary.value.high ?? 0,
  gapSummary.value.medium ?? 0,
  gapSummary.value.low ?? 0
])

const responseDonutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
  labels: ['Compliant', 'Gaps', 'Not Applicable', 'Unanswered'],
  colors: ['#22c55e', '#ef4444', '#94a3b8', '#e2e8f0'],
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Questions',
            fontSize: '12px',
            color: '#64748b',
            fontFamily: 'Inter, sans-serif',
            formatter: () =>
              String(
                (responseStats.value.yes ?? 0) +
                  (responseStats.value.no ?? 0) +
                  (responseStats.value.na ?? 0) +
                  (responseStats.value.unanswered ?? 0)
              )
          },
          value: {
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            color: '#0f172a'
          }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    markers: { width: 8, height: 8, radius: 99 }
  },
  stroke: { width: 2, colors: ['#ffffff'] },
  tooltip: { y: { formatter: (val: number) => `${val} question${val !== 1 ? 's' : ''}` } }
}))
const responseDonutSeries = computed(() => [
  responseStats.value.yes ?? 0,
  responseStats.value.no ?? 0,
  responseStats.value.na ?? 0,
  responseStats.value.unanswered ?? 0
])

const radarOptions = computed(() => ({
  chart: { type: 'radar', fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
  xaxis: {
    categories: moduleScores.value.map((m: any) =>
      m.module_name.length > 14 ? m.module_name.slice(0, 14) + '…' : m.module_name
    )
  },
  yaxis: { show: false, max: 100 },
  fill: { opacity: 0.15, colors: ['#3b82f6'] },
  stroke: { width: 2, colors: ['#3b82f6'] },
  markers: { size: 4, colors: ['#3b82f6'], strokeColors: '#fff', strokeWidth: 2 },
  plotOptions: {
    radar: { polygons: { strokeColors: '#e2e8f0', fill: { colors: ['#f8fafc', '#ffffff'] } } }
  },
  tooltip: { y: { formatter: (val: number) => `${Math.round(val)}%` } },
  dataLabels: { enabled: false }
}))
const radarSeries = computed(() => [
  { name: 'Score', data: moduleScores.value.map((m: any) => Math.round(m.module_score ?? 0)) }
])

// ── Helpers ─────────────────────────────────────────────────────────────
function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
function moduleRatingLabel(score: number) {
  if (score >= 90) return { label: 'Excellent', color: '#16a34a', bg: '#f0fdf4' }
  if (score >= 75) return { label: 'Healthy', color: '#65a30d', bg: '#f7fee7' }
  if (score >= 60) return { label: 'Satisfactory', color: '#d97706', bg: '#fffbeb' }
  if (score >= 45) return { label: 'Needs Work', color: '#ea580c', bg: '#fff7ed' }
  return { label: 'At Risk', color: '#dc2626', bg: '#fef2f2' }
}
function scoreBarColor(score: number) {
  if (score >= 75) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

async function handleLogout() {
  await authStore.logout()
  window.location.href = '/'
}
function goToAssessment() {
  window.open(
    `https://www.kyc.voimacaas.co.uk/#/assessment/new/${applicationId}`,
    '_blank',
    'noopener,noreferrer'
  )
}

const evidenceRequests = computed<any[]>(() => dashboard.value?.evidence_requests ?? [])
const uploadEvidenceForRequest = async (req: any, file: File) => {
  if (!file) return
  uploadingGapId.value = req.id
  try {
    const clientId = authStore.user?.client_id
    const assessmentId = dashboard.value.assessment_id
    const path = `${clientId}/${assessmentId}/${req.question_id}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('assessment-evidence')
      .upload(path, file, { contentType: file.type })
    if (uploadError) throw uploadError

    const { error: rpcError } = await supabase.rpc('client_submit_evidence', {
      p_assessment_id: assessmentId,
      p_question_id: req.question_id,
      p_file_path: path,
      p_file_name: file.name,
      p_file_size: file.size,
      p_mime_type: file.type
    })
    if (rpcError) throw rpcError

    showSnack('Evidence uploaded')
    await loadDashboard()
  } catch (e: any) {
    showSnack('Upload failed: ' + e.message)
  } finally {
    uploadingGapId.value = null
  }
}
const triggerFileInput = (id: string) => {
  const el = document.getElementById(id) as HTMLInputElement | null
  el?.click()
}
</script>

<template>
  <MainLayout>
    <div class="ch-screen">
      <!-- ── Top bar ── -->
      <header class="ch-topbar">
        <div class="ch-topbar-inner">
          <div class="ch-brand">
            <v-icon icon="mdi-shield-check" size="22" color="#2563eb" />
            <span>Voima Compliance Portal</span>
          </div>
          <v-btn variant="text" size="small" class="ch-logout" @click="handleLogout">
            <v-icon start icon="mdi-logout" size="15" />
            Sign out
          </v-btn>
        </div>
      </header>

      <main class="ch-main">
        <!-- Loading -->
        <div v-if="loading" class="ch-loader">
          <v-progress-circular indeterminate color="#2563eb" size="40" width="3" />
          <p>Loading compliance data…</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="ch-error">
          <v-icon icon="mdi-alert-circle-outline" size="32" color="#dc2626" />
          <p>{{ error }}</p>
        </div>

        <!-- No assessment yet -->
        <div v-else-if="!hasAssessment" class="ch-empty">
          <div class="ch-empty-icon">
            <v-icon icon="mdi-shield-off-outline" size="40" color="#94a3b8" />
          </div>
          <h2 class="ch-empty-title">Assessment pending review</h2>
          <p class="ch-empty-sub">
            Your compliance assessment is being reviewed by the Voima team. Your results will appear
            here once published.
          </p>
        </div>

        <template v-else>
          <!-- ── Page heading ── -->
          <div class="ch-page-head">
            <div class="ch-page-head-left">
              <div class="ch-page-eyebrow">Compliance Health Dashboard</div>
              <h1 class="ch-page-title">Your Compliance Overview</h1>
              <p class="ch-page-sub">
                Assessment <strong>{{ assessmentRef }}</strong> · Last updated
                {{ formatDate(dashboard?.updated_at) }}
              </p>
            </div>
            <div class="ch-page-head-right">
              <div
                class="ch-status-pill"
                :style="{ background: rating.bg, color: rating.color, borderColor: rating.border }"
              >
                <span class="ch-status-dot" :style="{ background: rating.color }" />
                {{ rating.label }}
              </div>
              <!-- <v-btn
                v-if="assessmentStatus !== 'completed'"
                class="ch-btn-primary"
                elevation="0"
                size="small"
                @click="goToAssessment"
              >
                <v-icon start size="15">mdi-pencil-outline</v-icon>
                Continue assessment
              </v-btn> -->
            </div>
          </div>
          <transition name="fade">
            <div v-if="liveUpdateBanner" class="ch-live-banner">
              <v-icon size="15" color="#2563eb">mdi-sync</v-icon>
              Your compliance data was just updated by your consultant
            </div>
          </transition>

          <!-- ── KPI strip ── -->
          <div class="ch-kpi-strip">
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #eff6ff">
                <v-icon icon="mdi-shield-half-full" size="20" color="#2563eb" />
              </div>
              <div>
                <div class="ch-kpi-value" :style="{ color: gaugeColor }">{{ healthScore }}%</div>
                <div class="ch-kpi-label">Health Score</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #fef2f2">
                <v-icon icon="mdi-alert-circle-outline" size="20" color="#dc2626" />
              </div>
              <div>
                <div class="ch-kpi-value" style="color: #dc2626">{{ gapSummary.open ?? 0 }}</div>
                <div class="ch-kpi-label">Open Gaps</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #fff7ed">
                <v-icon icon="mdi-fire-alert" size="20" color="#ea580c" />
              </div>
              <div>
                <div class="ch-kpi-value" style="color: #ea580c">
                  {{ gapSummary.critical ?? 0 }}
                </div>
                <div class="ch-kpi-label">Critical Gaps</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #f0fdf4">
                <v-icon icon="mdi-check-circle-outline" size="20" color="#16a34a" />
              </div>
              <div>
                <div class="ch-kpi-value" style="color: #16a34a">{{ responseStats.yes ?? 0 }}</div>
                <div class="ch-kpi-label">Compliant</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #f8fafc">
                <v-icon icon="mdi-help-circle-outline" size="20" color="#64748b" />
              </div>
              <div>
                <div class="ch-kpi-value" style="color: #64748b">
                  {{ responseStats.unanswered ?? 0 }}
                </div>
                <div class="ch-kpi-label">Unanswered</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #f8fafc">
                <v-icon icon="mdi-format-list-bulleted" size="20" color="#64748b" />
              </div>
              <div>
                <div class="ch-kpi-value" style="color: #334155">{{ moduleScores.length }}</div>
                <div class="ch-kpi-label">Modules</div>
              </div>
            </div>
          </div>

          <!-- ── Row 1: Gauge + Radar ── -->
          <div class="ch-grid-2 mt-6">
            <!-- Overall score card -->
            <div class="ch-card">
              <div class="ch-card-head">
                <v-icon icon="mdi-gauge" size="16" color="#2563eb" />
                <span class="ch-card-title">Overall Compliance Score</span>
              </div>
              <div class="ch-card-body ch-gauge-body">
                <VueApexCharts
                  type="radialBar"
                  height="280"
                  :options="radialOptions"
                  :series="radialSeries"
                />
                <div class="ch-gauge-meta">
                  <div
                    class="ch-rating-badge"
                    :style="{
                      background: rating.bg,
                      color: rating.color,
                      borderColor: rating.border
                    }"
                  >
                    {{ rating.label }}
                  </div>
                  <p class="ch-gauge-hint">
                    Based on {{ moduleScores.length }} compliance modules weighted by risk category
                  </p>
                </div>

                <!-- Rating scale -->
                <div class="ch-scale">
                  <div
                    class="ch-scale-item"
                    v-for="r in [
                      { range: '90–100', label: 'Excellent', color: '#16a34a' },
                      { range: '75–89', label: 'Healthy', color: '#65a30d' },
                      { range: '60–74', label: 'Satisfactory', color: '#d97706' },
                      { range: '45–59', label: 'Needs Work', color: '#ea580c' },
                      { range: '<45', label: 'At Risk', color: '#dc2626' }
                    ]"
                    :key="r.label"
                  >
                    <span class="ch-scale-dot" :style="{ background: r.color }" />
                    <span class="ch-scale-range">{{ r.range }}</span>
                    <span class="ch-scale-label">{{ r.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Radar -->
            <div class="ch-card">
              <div class="ch-card-head">
                <v-icon icon="mdi-radar" size="16" color="#2563eb" />
                <span class="ch-card-title">Module Coverage Radar</span>
              </div>
              <div class="ch-card-body">
                <VueApexCharts
                  v-if="moduleScores.length"
                  type="radar"
                  height="300"
                  :options="radarOptions"
                  :series="radarSeries"
                />
                <div v-else class="ch-chart-empty">No module data yet</div>
              </div>
            </div>
          </div>

          <!-- ── Row 2: Module horizontal bar (full width) ── -->
          <div class="ch-card mt-6">
            <div class="ch-card-head">
              <v-icon icon="mdi-view-list-outline" size="16" color="#2563eb" />
              <span class="ch-card-title">Score by Module</span>
              <span class="ch-card-sub">Each bar shows the compliance score for that module</span>
            </div>
            <div class="ch-card-body">
              <VueApexCharts
                v-if="moduleScores.length"
                type="bar"
                :height="Math.max(280, moduleScores.length * 46)"
                :options="moduleBarOptions"
                :series="moduleBarSeries"
              />
              <div v-else class="ch-chart-empty">No module scores available yet</div>
            </div>
          </div>

          <!-- ── Gaps register with evidence upload ── -->
          <div class="ch-card mt-6" v-if="gaps.length">
            <div class="ch-card-head">
              <v-icon icon="mdi-clipboard-alert-outline" size="16" color="#dc2626" />
              <span class="ch-card-title">Compliance Gaps</span>
              <span class="ch-card-sub">{{ gaps.length }} identified</span>
            </div>
            <div class="ch-gaps-body">
              <div
                v-for="gap in gaps"
                :key="gap.id"
                class="gap-row"
                :style="`border-left-color: ${riskColor(gap.risk_rating)}`"
              >
                <div class="gap-row-head">
                  <span class="gap-ref">{{ gap.gap_ref }}</span>
                  <span
                    class="gap-risk-chip"
                    :style="{
                      background: riskColor(gap.risk_rating) + '18',
                      color: riskColor(gap.risk_rating)
                    }"
                  >
                    {{ gap.risk_rating }}
                  </span>
                  <span class="gap-module">{{ gap.module_name }}</span>
                </div>
                <p class="gap-title">{{ gap.title }}</p>
                <p class="gap-desc">{{ gap.description }}</p>
                <div v-if="gap.remediation_action" class="gap-remediation">
                  <v-icon size="13" color="#7c3aed">mdi-lightbulb-outline</v-icon>
                  {{ gap.remediation_action }}
                </div>

                <!-- Evidence request / upload -->
                <div
                  v-if="gap.evidence_request"
                  class="gap-evidence"
                  :class="evidenceStatusClass(gap.evidence_request.status)"
                >
                  <div class="gap-ev-head">
                    <v-icon size="13">mdi-paperclip</v-icon>
                    {{ evidenceStatusLabel(gap.evidence_request.status) }}
                    <span v-if="gap.evidence_request.due_date" class="gap-ev-due">
                      · due {{ formatDate(gap.evidence_request.due_date) }}
                    </span>
                  </div>
                  <p class="gap-ev-instructions">{{ gap.evidence_request.instructions }}</p>
                  <p
                    v-if="
                      gap.evidence_request.status === 'rejected' &&
                      gap.evidence_request.review_notes
                    "
                    class="gap-ev-rejected-note"
                  >
                    <v-icon size="12" color="#dc2626">mdi-alert-circle-outline</v-icon>
                    {{ gap.evidence_request.review_notes }}
                  </p>

                  <div v-if="gap.evidence_files?.length" class="gap-ev-files">
                    <div v-for="f in gap.evidence_files" :key="f.id" class="gap-ev-file">
                      <v-icon size="12">mdi-file-outline</v-icon>{{ f.file_name }}
                    </div>
                  </div>

                  <input
                    type="file"
                    :id="`gap-file-${gap.id}`"
                    style="display: none"
                    @change="(e: any) => uploadEvidence(gap, e.target.files[0])"
                  />
                  <v-btn
                    v-if="gap.evidence_request.status !== 'approved'"
                    size="small"
                    variant="tonal"
                    color="primary"
                    class="mt-2"
                    :loading="uploadingGapId === gap.id"
                    @click="triggerFileInput(`gap-file-${gap.id}`)"
                  >
                    <v-icon start size="15">mdi-upload</v-icon>
                    {{ gap.evidence_files?.length ? 'Upload another file' : 'Upload evidence' }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <div class="ch-card mt-6" v-if="evidenceRequests.length">
            <div class="ch-card-head">
              <v-icon icon="mdi-paperclip" size="16" color="#2563eb" />
              <span class="ch-card-title">Evidence Requests</span>
              <span class="ch-card-sub">{{ evidenceRequests.length }} from your consultant</span>
            </div>
            <div class="ch-gaps-body">
              <div
                v-for="req in evidenceRequests"
                :key="req.id"
                class="gap-evidence"
                :class="evidenceStatusClass(req.status)"
              >
                <div class="gap-ev-head">
                  <v-icon size="13">mdi-paperclip</v-icon>
                  {{ evidenceStatusLabel(req.status) }}
                  <span class="gap-ev-due" v-if="req.due_date">
                    · due {{ formatDate(req.due_date) }}
                  </span>
                </div>
                <p class="gap-ev-instructions">
                  <strong>{{ req.question_ref }}</strong> — {{ req.question_text }}
                </p>
                <p class="gap-ev-instructions">{{ req.instructions }}</p>
                <p
                  v-if="req.status === 'rejected' && req.review_notes"
                  class="gap-ev-rejected-note"
                >
                  <v-icon size="12" color="#dc2626">mdi-alert-circle-outline</v-icon>
                  {{ req.review_notes }}
                </p>

                <div v-if="req.evidence_files?.length" class="gap-ev-files">
                  <div v-for="f in req.evidence_files" :key="f.id" class="gap-ev-file">
                    <v-icon size="12">mdi-file-outline</v-icon>{{ f.file_name }}
                  </div>
                </div>

                <input
                  type="file"
                  :id="`req-file-${req.id}`"
                  style="display: none"
                  @change="(e: any) => uploadEvidenceForRequest(req, e.target.files[0])"
                />
                <v-btn
                  v-if="req.status !== 'approved'"
                  size="small"
                  variant="tonal"
                  color="primary"
                  class="mt-2"
                  :loading="uploadingGapId === req.id"
                  @click="triggerFileInput(`req-file-${req.id}`)"
                >
                  <v-icon start size="15">mdi-upload</v-icon>
                  {{ req.evidence_files?.length ? 'Upload another file' : 'Upload evidence' }}
                </v-btn>
              </div>
            </div>
          </div>

          <!-- ── Row 3: Gap donut + Response donut ── -->
          <div class="ch-grid-2 mt-6">
            <div class="ch-card">
              <div class="ch-card-head">
                <v-icon icon="mdi-alert-decagram-outline" size="16" color="#dc2626" />
                <span class="ch-card-title">Gap Breakdown</span>
                <span class="ch-card-sub">By severity</span>
              </div>
              <div class="ch-card-body">
                <VueApexCharts
                  type="donut"
                  height="260"
                  :options="gapDonutOptions"
                  :series="gapDonutSeries"
                />
                <!-- Gap summary pills -->
                <div class="ch-gap-pills">
                  <div class="ch-gap-pill critical">
                    <span class="ch-gap-pill-val">{{ gapSummary.critical ?? 0 }}</span>
                    <span>Critical</span>
                  </div>
                  <div class="ch-gap-pill high">
                    <span class="ch-gap-pill-val">{{ gapSummary.high ?? 0 }}</span>
                    <span>High</span>
                  </div>
                  <div class="ch-gap-pill medium">
                    <span class="ch-gap-pill-val">{{ gapSummary.medium ?? 0 }}</span>
                    <span>Medium</span>
                  </div>
                  <div class="ch-gap-pill low">
                    <span class="ch-gap-pill-val">{{ gapSummary.low ?? 0 }}</span>
                    <span>Low</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="ch-card">
              <div class="ch-card-head">
                <v-icon icon="mdi-chart-pie-outline" size="16" color="#2563eb" />
                <span class="ch-card-title">Response Breakdown</span>
                <span class="ch-card-sub">Across all questions</span>
              </div>
              <div class="ch-card-body">
                <VueApexCharts
                  type="donut"
                  height="260"
                  :options="responseDonutOptions"
                  :series="responseDonutSeries"
                />
                <div class="ch-resp-stats">
                  <div class="ch-resp-stat">
                    <span class="ch-resp-dot" style="background: #22c55e" />
                    <span class="ch-resp-label">Compliant</span>
                    <span class="ch-resp-val">{{ responseStats.yes ?? 0 }}</span>
                  </div>
                  <div class="ch-resp-stat">
                    <span class="ch-resp-dot" style="background: #ef4444" />
                    <span class="ch-resp-label">Gaps</span>
                    <span class="ch-resp-val">{{ responseStats.no ?? 0 }}</span>
                  </div>
                  <div class="ch-resp-stat">
                    <span class="ch-resp-dot" style="background: #94a3b8" />
                    <span class="ch-resp-label">N/A</span>
                    <span class="ch-resp-val">{{ responseStats.na ?? 0 }}</span>
                  </div>
                  <div class="ch-resp-stat">
                    <span class="ch-resp-dot" style="background: #e2e8f0" />
                    <span class="ch-resp-label">Unanswered</span>
                    <span class="ch-resp-val">{{ responseStats.unanswered ?? 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Row 4: Module score table ── -->
          <div class="ch-card mt-6">
            <div class="ch-card-head">
              <v-icon icon="mdi-table-check" size="16" color="#2563eb" />
              <span class="ch-card-title">Module Detail</span>
              <span class="ch-card-sub">Scores for each compliance module</span>
            </div>
            <div class="ch-table-wrap">
              <table class="ch-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Score</th>
                    <th class="ch-th-bar">Progress</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="mod in moduleScores" :key="mod.module_id">
                    <td>
                      <div class="ch-mod-name">{{ mod.module_name }}</div>
                      <div class="ch-mod-desc">{{ mod.module_description }}</div>
                      <div v-if="mod.consultant_note" class="ch-mod-note">
                        <v-icon size="11" color="#7c3aed">mdi-account-tie-outline</v-icon>
                        {{ mod.consultant_note }}
                      </div>
                    </td>
                    <td>
                      <span class="ch-score-num" :style="{ color: scoreBarColor(mod.module_score) }"
                        >{{ Math.round(mod.module_score ?? 0) }}%</span
                      >
                    </td>
                    <td class="ch-td-bar">
                      <div class="ch-bar-track">
                        <div
                          class="ch-bar-fill"
                          :style="{
                            width: Math.round(mod.module_score ?? 0) + '%',
                            background: scoreBarColor(mod.module_score)
                          }"
                        />
                      </div>
                    </td>
                    <!-- <td>
                      <span class="ch-weight-pill">{{ mod.weight ?? 0 }}%</span>
                    </td> -->
                    <td>
                      <span
                        class="ch-mod-rating"
                        :style="{
                          background: moduleRatingLabel(mod.module_score).bg,
                          color: moduleRatingLabel(mod.module_score).color
                        }"
                        >{{ moduleRatingLabel(mod.module_score).label }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ── CTA if not complete ── -->
          <!-- <div v-if="assessmentStatus !== 'completed'" class="ch-cta-banner mt-6">
            <div class="ch-cta-left">
              <v-icon icon="mdi-clipboard-edit-outline" size="22" color="#2563eb" />
              <div>
                <div class="ch-cta-title">Your assessment is not yet complete</div>
                <div class="ch-cta-sub">
                  Answer all questions to get your final compliance health score and full gap
                  register.
                </div>
              </div>
            </div>
            <v-btn class="ch-btn-primary" elevation="0" @click="goToAssessment">
              Continue assessment
              <v-icon end size="15">mdi-arrow-right</v-icon>
            </v-btn>
          </div> -->
        </template>
      </main>
    </div>
    <v-snackbar v-model="snack.show" :timeout="4000" location="bottom right">
      {{ snack.message }}
      <template #actions>
        <v-btn variant="text" @click="snack.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </MainLayout>
</template>

<style scoped>
/* ── Tokens ─────────────────────────────────────────────────────────── */
:root {
  --ch-bg: #f1f5f9;
  --ch-surface: #ffffff;
  --ch-border: #e2e8f0;
  --ch-border-d: #cbd5e1;
  --ch-ink: #0f172a;
  --ch-muted: #64748b;
  --ch-subtle: #94a3b8;
  --ch-blue: #2563eb;
  --ch-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 14px rgba(0, 0, 0, 0.06);
}

/* ── Shell ──────────────────────────────────────────────────────────── */
.ch-screen {
  min-height: 100vh;
  background: #f1f5f9;
}

/* ── Top bar ────────────────────────────────────────────────────────── */
.ch-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
}
.ch-topbar-inner {
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ch-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.ch-logout {
  font-size: 12px !important;
  color: #64748b !important;
  text-transform: none !important;
}

/* ── Main ───────────────────────────────────────────────────────────── */
.ch-main {
  margin: 0 auto;
  padding: 28px 24px 60px;
}

/* ── States ─────────────────────────────────────────────────────────── */
.ch-loader,
.ch-error,
.ch-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 360px;
  color: #64748b;
  font-size: 14px;
  text-align: center;
}
.ch-empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ch-empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}
.ch-empty-sub {
  font-size: 14px;
  color: #64748b;
  max-width: 380px;
}

/* ── Page heading ───────────────────────────────────────────────────── */
.ch-page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.ch-page-head-left {
}
.ch-page-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2563eb;
  margin-bottom: 4px;
}
.ch-page-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin: 0 0 4px;
}
.ch-page-sub {
  font-size: 13px;
  color: #64748b;
}
.ch-page-head-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.ch-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  border: 1.5px solid;
}
.ch-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── KPI strip ──────────────────────────────────────────────────────── */
.ch-kpi-strip {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}
@media (max-width: 1100px) {
  .ch-kpi-strip {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 640px) {
  .ch-kpi-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

.ch-kpi-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--ch-shadow);
}
.ch-kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ch-kpi-value {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}
.ch-kpi-label {
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
  font-weight: 500;
}

/* ── Grid ───────────────────────────────────────────────────────────── */
.ch-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 900px) {
  .ch-grid-2 {
    grid-template-columns: 1fr;
  }
}
.mt-6 {
  margin-top: 20px;
}

/* ── Card ───────────────────────────────────────────────────────────── */
.ch-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: var(--ch-shadow);
  overflow: hidden;
}
.ch-card-head {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ch-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.ch-card-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-left: auto;
}
.ch-card-body {
  padding: 16px 20px;
}

/* ── Gauge card extras ──────────────────────────────────────────────── */
.ch-gauge-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ch-gauge-meta {
  text-align: center;
  margin-top: 4px;
}
.ch-rating-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  border: 1.5px solid;
  margin-bottom: 8px;
}
.ch-gauge-hint {
  font-size: 12px;
  color: #94a3b8;
  max-width: 240px;
  line-height: 1.5;
}
.ch-scale {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  justify-content: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  width: 100%;
}
.ch-scale-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #64748b;
}
.ch-scale-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ch-scale-range {
  color: #334155;
  font-weight: 600;
}
.ch-scale-label {
  color: #94a3b8;
}

/* ── Empty chart state ──────────────────────────────────────────────── */
.ch-chart-empty {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #94a3b8;
}

/* ── Gap pills ──────────────────────────────────────────────────────── */
.ch-gap-pills {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.ch-gap-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  min-width: 58px;
  text-align: center;
}
.ch-gap-pill-val {
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
}
.ch-gap-pill.critical {
  background: #fef2f2;
  color: #dc2626;
}
.ch-gap-pill.high {
  background: #fff7ed;
  color: #ea580c;
}
.ch-gap-pill.medium {
  background: #fffbeb;
  color: #d97706;
}
.ch-gap-pill.low {
  background: #f7fee7;
  color: #65a30d;
}

/* ── Response stats ─────────────────────────────────────────────────── */
.ch-resp-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}
.ch-resp-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.ch-resp-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ch-resp-label {
  color: #64748b;
  flex: 1;
}
.ch-resp-val {
  font-weight: 700;
  color: #0f172a;
}

/* ── Module table ───────────────────────────────────────────────────── */
.ch-table-wrap {
  overflow-x: auto;
}
.ch-table {
  width: 100%;
  border-collapse: collapse;
}
.ch-table thead th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
  padding: 10px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.ch-table tbody td {
  padding: 14px 20px;
  font-size: 13px;
  color: #475569;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}
.ch-table tbody tr:last-child td {
  border-bottom: none;
}
.ch-table tbody tr:hover {
  background: #fafcff;
}

.ch-mod-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
.ch-mod-desc {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}
.ch-score-num {
  font-size: 15px;
  font-weight: 800;
}
.ch-th-bar,
.ch-td-bar {
  min-width: 160px;
}
.ch-bar-track {
  height: 6px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}
.ch-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
}
.ch-weight-pill {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 99px;
}
.ch-mod-rating {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
}

/* ── CTA banner ─────────────────────────────────────────────────────── */
.ch-cta-banner {
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  border-radius: 14px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.ch-cta-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.ch-cta-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e3a8a;
}
.ch-cta-sub {
  font-size: 13px;
  color: #3b82f6;
  margin-top: 2px;
}

/* ── Buttons ────────────────────────────────────────────────────────── */
.ch-btn-primary {
  background: #1d4ed8 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 10px !important;
  font-size: 13px !important;
  letter-spacing: 0 !important;
  padding: 0 18px !important;
  height: 40px !important;
}
.ch-btn-primary:hover {
  background: #1e40af !important;
}
.mt-4 {
  margin-top: 16px;
}

.ch-live-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 10px;
  margin-bottom: 16px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.ch-mod-note {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: 11px;
  color: #7c3aed;
  margin-top: 6px;
  font-style: italic;
  line-height: 1.4;
}

.ch-gaps-body {
  padding: 8px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gap-row {
  border-left: 3px solid;
  background: #fafafa;
  border-radius: 0 10px 10px 0;
  padding: 14px 16px;
}
.gap-row-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.gap-ref {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}
.gap-risk-chip {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 99px;
}
.gap-module {
  font-size: 11px;
  color: #94a3b8;
  margin-left: auto;
}
.gap-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px;
}
.gap-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 8px;
  line-height: 1.5;
}
.gap-remediation {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #6d28d9;
  margin-bottom: 10px;
}

.gap-evidence {
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid;
  margin-top: 8px;
}
.gap-ev-requested {
  background: #fff7ed;
  border-color: #fed7aa;
}
.gap-ev-submitted {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.gap-ev-approved {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.gap-ev-rejected {
  background: #fef2f2;
  border-color: #fca5a5;
}

.gap-ev-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
}
.gap-ev-due {
  font-weight: 400;
  color: #94a3b8;
}
.gap-ev-instructions {
  font-size: 12px;
  color: #334155;
  margin: 0 0 6px;
}
.gap-ev-rejected-note {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #b91c1c;
  margin: 0 0 6px;
}
.gap-ev-files {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 4px;
}
.gap-ev-file {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #64748b;
}
</style>
