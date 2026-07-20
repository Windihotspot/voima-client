import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useApplicantAuthStore } from '@/stores/applicationAuth'

export interface UseComplianceHealthOptions {
  /** Set to false to skip the automatic Supabase Realtime subscription (default: true) */
  realtime?: boolean
}

/**
 * Central composable for the Compliance Health Dashboard.
 * Owns: RPC loading, realtime subscriptions, evidence upload, and every
 * computed value the dashboard / gaps pages need.
 *
 * Each component that calls this gets its OWN reactive state + its own
 * realtime channel (auto torn down on unmount). That matches the original
 * single-page behaviour and keeps things simple — if you later want a
 * single shared instance across the dashboard + gaps page (e.g. to avoid
 * double-fetching when both are mounted at once), lift the returned refs
 * into a Pinia store instead.
 */
export function useComplianceHealth(options: UseComplianceHealthOptions = {}) {
  const { realtime = true } = options
  const authStore = useApplicantAuthStore()

  // ── State ────────────────────────────────────────────────────────────
  const loading = ref(true)
  const error = ref<string | null>(null)
  const dashboard = ref<any>(null)
  const liveUpdateBanner = ref(false)
  const uploadingId = ref<string | null>(null)
  let realtimeChannel: any = null

  const snack = reactive({ show: false, message: '' })
  const showSnack = (message: string) => {
    snack.message = message
    snack.show = true
  }

  // ── Load ─────────────────────────────────────────────────────────────
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

  // ── Realtime ─────────────────────────────────────────────────────────
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

  const init = async () => {
    await authStore.restoreSession()
    await loadDashboard()
    if (realtime) subscribeToChanges()
  }

  const cleanup = () => {
    if (realtimeChannel) supabase.removeChannel(realtimeChannel)
  }

  onMounted(init)
  onUnmounted(cleanup)

  // ── Evidence upload (shared by gap rows + evidence-request rows) ─────
  const uploadFile = async (file: File, meta: { questionId: string; targetId: string }) => {
    if (!file) return
    uploadingId.value = meta.targetId
    try {
      const clientId = authStore.user?.client_id
      const assessmentId = dashboard.value?.assessment_id
      const path = `${clientId}/${assessmentId}/${meta.questionId}/${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('assessment-evidence')
        .upload(path, file, { contentType: file.type })
      if (uploadError) throw uploadError

      const { error: rpcError } = await supabase.rpc('client_submit_evidence', {
        p_assessment_id: assessmentId,
        p_question_id: meta.questionId,
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
      uploadingId.value = null
    }
  }

  const uploadEvidenceForGap = (gap: any, file: File) =>
    uploadFile(file, { questionId: gap.question_id, targetId: gap.id })

  const uploadEvidenceForRequest = (req: any, file: File) =>
    uploadFile(file, { questionId: req.question_id, targetId: req.id })

  const triggerFileInput = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null
    el?.click()
  }

  // ── Derived data ────────────────────────────────────────────────────
  const hasAssessment = computed(() => dashboard.value?.has_assessment === true)
  const healthScore = computed(() => Math.round(dashboard.value?.health_score ?? 0))
  const healthRating = computed(() => dashboard.value?.health_rating ?? 'needs_improvement')
  const moduleScores = computed<any[]>(() => dashboard.value?.module_scores ?? [])
  const gapSummary = computed(() => dashboard.value?.gap_summary ?? {})
  const responseStats = computed(() => dashboard.value?.response_stats ?? {})
  const gaps = computed<any[]>(() => dashboard.value?.gaps ?? [])
  const evidenceRequests = computed<any[]>(() => dashboard.value?.evidence_requests ?? [])
  const assessmentStatus = computed(() => dashboard.value?.status ?? 'not_started')
  const assessmentRef = computed(() => dashboard.value?.assessment_ref ?? '')
  const applicationId = computed(() => authStore.user?.application_id)

  // Gap-analysis-specific groupings, for the standalone gaps page
  const openGaps = computed(() => gaps.value.filter((g) => g.status !== 'completed'))
  const completedGaps = computed(() => gaps.value.filter((g) => g.status === 'completed'))

  const gapsByRisk = computed(() => {
    const order = ['critical', 'high', 'medium', 'low']
    return order
      .map((risk) => ({ risk, items: gaps.value.filter((g) => g.risk_rating === risk) }))
      .filter((g) => g.items.length)
  })

  const gapsByModule = computed(() => {
    const map = new Map<string, any[]>()
    for (const g of gaps.value) {
      const key = g.module_name || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(g)
    }
    return Array.from(map.entries()).map(([module_name, items]) => ({ module_name, items }))
  })

  // ── Rating config ─────────────────────────────────────────────────────
  const ratingConfig: Record<string, { label: string; color: string; bg: string; border: string }> =
    {
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
    (
      ({ critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#65a30d' }) as Record<
        string,
        string
      >
    )[r] || '#94a3b8'

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

  function goToAssessment() {
    window.open(
      `https://www.kyc.voimacaas.co.uk/assessment/new/${applicationId.value}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  async function handleLogout() {
    await authStore.logout()
    window.location.href = '/'
  }

  return {
    // state
    loading,
    error,
    dashboard,
    liveUpdateBanner,
    uploadingId,
    snack,
    // lifecycle (exposed in case a consumer wants manual control instead of the auto onMounted)
    init,
    cleanup,
    loadDashboard,
    // evidence
    uploadEvidenceForGap,
    uploadEvidenceForRequest,
    triggerFileInput,
    showSnack,
    // derived
    hasAssessment,
    healthScore,
    healthRating,
    moduleScores,
    gapSummary,
    responseStats,
    gaps,
    evidenceRequests,
    assessmentStatus,
    assessmentRef,
    applicationId,
    openGaps,
    completedGaps,
    gapsByRisk,
    gapsByModule,
    rating,
    gaugeColor,
    riskColor,
    evidenceStatusLabel,
    evidenceStatusClass,
    // helpers
    formatDate,
    moduleRatingLabel,
    scoreBarColor,
    goToAssessment,
    handleLogout
  }
}
