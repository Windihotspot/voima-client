<script setup lang="ts">
import { ref, computed } from 'vue'
import MainLayout from '@/components/Layouts/MainLayout.vue'
import { useComplianceHealth } from '@/composables/UsecomplianceHealth'

const {
  loading,
  error,
  hasAssessment,
  assessmentRef,
  assessmentStatus,
  liveUpdateBanner,
  snack,
  gaps,
  openGaps,
  completedGaps,
  gapSummary,
  evidenceRequests,
  uploadingId,
  uploadEvidenceForGap,
  uploadEvidenceForRequest,
  triggerFileInput,
  riskColor,
  evidenceStatusLabel,
  evidenceStatusClass,
  formatDate,
  goToAssessment
} = useComplianceHealth()

// ── Filters (page-local, not part of the shared composable) ───────────
const riskFilter = ref<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
const statusFilter = ref<'all' | 'open' | 'completed'>('all')
const moduleFilter = ref<string>('all')
const search = ref('')

const moduleOptions = computed(() => {
  const set = new Set(gaps.value.map((g) => g.module_name).filter(Boolean))
  return ['all', ...Array.from(set)]
})

const filteredGaps = computed(() => {
  return gaps.value.filter((g) => {
    if (riskFilter.value !== 'all' && g.risk_rating !== riskFilter.value) return false
    if (statusFilter.value === 'open' && g.status === 'completed') return false
    if (statusFilter.value === 'completed' && g.status !== 'completed') return false
    if (moduleFilter.value !== 'all' && g.module_name !== moduleFilter.value) return false
    if (search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      const haystack = `${g.gap_ref} ${g.title} ${g.description} ${g.module_name}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
})

const riskCounts = computed(() => ({
  critical: gapSummary.value.critical ?? 0,
  high: gapSummary.value.high ?? 0,
  medium: gapSummary.value.medium ?? 0,
  low: gapSummary.value.low ?? 0
}))

function resetFilters() {
  riskFilter.value = 'all'
  statusFilter.value = 'all'
  moduleFilter.value = 'all'
  search.value = ''
}
</script>

<template>
  <MainLayout>
    <div class="gap-screen">
      <header class="gap-topbar">
        <div class="gap-topbar-inner">
          <div class="gap-brand">
            <v-icon icon="mdi-clipboard-alert-outline" size="22" color="#dc2626" />
            <span>Compliance Gap Analysis</span>
          </div>
          <v-btn variant="text" size="small" class="gap-back" to="/dashboard">
            <v-icon start icon="mdi-arrow-left" size="15" />
            Back to dashboard
          </v-btn>
        </div>
      </header>

      <main class="gap-main">
        <div v-if="loading" class="gap-state">
          <v-progress-circular indeterminate color="#2563eb" size="40" width="3" />
          <p>Loading gap data…</p>
        </div>

        <div v-else-if="error" class="gap-state">
          <v-icon icon="mdi-alert-circle-outline" size="32" color="#dc2626" />
          <p>{{ error }}</p>
        </div>

        <div v-else-if="!hasAssessment" class="gap-state">
          <v-icon icon="mdi-shield-off-outline" size="40" color="#94a3b8" />
          <h2 class="gap-empty-title">Assessment pending review</h2>
          <p class="gap-empty-sub">
            Gap analysis will appear here once your compliance assessment has been published.
          </p>
        </div>

        <template v-else>
          <!-- Page head -->
          <div class="gap-page-head">
            <div>
              <div class="gap-eyebrow">Gap Analysis</div>
              <h1 class="gap-title-lg">Compliance Gaps &amp; Evidence</h1>
              <p class="gap-sub">
                Assessment <strong>{{ assessmentRef }}</strong>
              </p>
            </div>
            <v-btn
              v-if="assessmentStatus !== 'completed'"
              class="gap-btn-primary"
              elevation="0"
              size="small"
              @click="goToAssessment"
            >
              <v-icon start size="15">mdi-pencil-outline</v-icon>
              Continue assessment
            </v-btn>
          </div>

          <transition name="fade">
            <div v-if="liveUpdateBanner" class="gap-live-banner">
              <v-icon size="15" color="#2563eb">mdi-sync</v-icon>
              Gap data was just updated by your consultant
            </div>
          </transition>

          <!-- Summary strip -->
          <div class="gap-summary-strip">
            <div class="gap-summary-card">
              <div class="gap-summary-val">{{ gapSummary.total ?? 0 }}</div>
              <div class="gap-summary-label">Total Gaps</div>
            </div>
            <div class="gap-summary-card">
              <div class="gap-summary-val" style="color: #dc2626">{{ gapSummary.open ?? 0 }}</div>
              <div class="gap-summary-label">Open</div>
            </div>
            <div class="gap-summary-card">
              <div class="gap-summary-val" style="color: #ea580c">
                {{ gapSummary.overdue ?? 0 }}
              </div>
              <div class="gap-summary-label">Overdue</div>
            </div>
            <div class="gap-summary-card">
              <div class="gap-summary-val" style="color: #16a34a">
                {{ gapSummary.completed ?? 0 }}
              </div>
              <div class="gap-summary-label">Completed</div>
            </div>
          </div>

          <!-- Risk breakdown pills -->
          <div class="gap-risk-strip">
            <button
              v-for="risk in ['critical', 'high', 'medium', 'low'] as const"
              :key="risk"
              class="gap-risk-pill"
              :class="{ active: riskFilter === risk }"
              :style="{ '--rc': riskColor(risk) }"
              @click="riskFilter = riskFilter === risk ? 'all' : risk"
            >
              <span class="gap-risk-pill-val">{{ riskCounts[risk] }}</span>
              <span class="gap-risk-pill-label">{{ risk }}</span>
            </button>
          </div>

          <!-- Filters -->
          <div class="gap-filters">
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              hide-details
              placeholder="Search gaps…"
              prepend-inner-icon="mdi-magnify"
              class="gap-filter-search"
            />
            <v-select
              v-model="statusFilter"
              density="compact"
              variant="outlined"
              hide-details
              class="gap-filter-select"
              :items="[
                { title: 'All statuses', value: 'all' },
                { title: 'Open', value: 'open' },
                { title: 'Completed', value: 'completed' }
              ]"
              item-title="title"
              item-value="value"
            />
            <v-select
              v-model="moduleFilter"
              density="compact"
              variant="outlined"
              hide-details
              class="gap-filter-select"
              :items="moduleOptions"
            />
            <v-btn variant="text" size="small" @click="resetFilters">Reset</v-btn>
          </div>

          <!-- Gap list -->
          <div class="gap-card">
            <div class="gap-card-head">
              <v-icon icon="mdi-clipboard-alert-outline" size="16" color="#dc2626" />
              <span class="gap-card-title">Gaps</span>
              <span class="gap-card-sub">{{ filteredGaps.length }} of {{ gaps.length }}</span>
            </div>

            <div v-if="!filteredGaps.length" class="gap-empty-list">
              No gaps match the current filters.
            </div>

            <div v-else class="gap-list-body">
              <div
                v-for="gap in filteredGaps"
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
                  <span
                    class="gap-status-chip"
                    :class="gap.status === 'completed' ? 'is-completed' : 'is-open'"
                  >
                    {{ gap.status === 'completed' ? 'Completed' : 'Open' }}
                  </span>
                  <span class="gap-module">{{ gap.module_name }}</span>
                </div>
                <p class="gap-row-title">{{ gap.title }}</p>
                <p class="gap-desc">{{ gap.description }}</p>
                <div v-if="gap.remediation_action" class="gap-remediation">
                  <v-icon size="13" color="#7c3aed">mdi-lightbulb-outline</v-icon>
                  {{ gap.remediation_action }}
                </div>

                <!-- Evidence on the gap itself -->
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
                    @change="(e: any) => uploadEvidenceForGap(gap, e.target.files[0])"
                  />
                  <v-btn
                    v-if="gap.evidence_request.status !== 'approved'"
                    size="small"
                    variant="tonal"
                    color="primary"
                    class="mt-2"
                    :loading="uploadingId === gap.id"
                    @click="triggerFileInput(`gap-file-${gap.id}`)"
                  >
                    <v-icon start size="15">mdi-upload</v-icon>
                    {{ gap.evidence_files?.length ? 'Upload another file' : 'Upload evidence' }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Evidence requests -->
          <div class="gap-card mt-6" v-if="evidenceRequests.length">
            <div class="gap-card-head">
              <v-icon icon="mdi-paperclip" size="16" color="#2563eb" />
              <span class="gap-card-title">Evidence Requests</span>
              <span class="gap-card-sub">{{ evidenceRequests.length }} from your consultant</span>
            </div>
            <div class="gap-list-body">
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
                  :loading="uploadingId === req.id"
                  @click="triggerFileInput(`req-file-${req.id}`)"
                >
                  <v-icon start size="15">mdi-upload</v-icon>
                  {{ req.evidence_files?.length ? 'Upload another file' : 'Upload evidence' }}
                </v-btn>
              </div>
            </div>
          </div>
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
.gap-screen {
  min-height: 100vh;
  background: #f1f5f9;
}
.gap-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
}
.gap-topbar-inner {
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gap-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.gap-back {
  font-size: 12px !important;
  color: #64748b !important;
  text-transform: none !important;
}
.gap-main {
  margin: 0 auto;
  padding: 28px 24px 60px;
}
.gap-state {
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
.gap-empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}
.gap-empty-sub {
  font-size: 14px;
  color: #64748b;
  max-width: 380px;
}
.gap-page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.gap-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #dc2626;
  margin-bottom: 4px;
}
.gap-title-lg {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin: 0 0 4px;
}
.gap-sub {
  font-size: 13px;
  color: #64748b;
}
.gap-live-banner {
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
.gap-summary-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
@media (max-width: 640px) {
  .gap-summary-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}
.gap-summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 14px rgba(0, 0, 0, 0.06);
}
.gap-summary-val {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}
.gap-summary-label {
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
  font-weight: 500;
}
.gap-risk-strip {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.gap-risk-pill {
  --rc: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 18px;
  border-radius: 12px;
  border: 1.5px solid transparent;
  background: color-mix(in srgb, var(--rc) 10%, white);
  color: var(--rc);
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
  min-width: 80px;
}
.gap-risk-pill.active {
  border-color: var(--rc);
}
.gap-risk-pill-val {
  font-size: 18px;
  font-weight: 800;
}
.gap-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.gap-filter-search {
  max-width: 260px;
}
.gap-filter-select {
  max-width: 200px;
}
.gap-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 14px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.gap-card-head {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8px;
}
.gap-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.gap-card-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-left: auto;
}
.gap-empty-list {
  padding: 32px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}
.gap-list-body {
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
  flex-wrap: wrap;
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
.gap-status-chip {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 99px;
}
.gap-status-chip.is-open {
  background: #fff7ed;
  color: #ea580c;
}
.gap-status-chip.is-completed {
  background: #f0fdf4;
  color: #16a34a;
}
.gap-module {
  font-size: 11px;
  color: #94a3b8;
  margin-left: auto;
}
.gap-row-title {
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
.gap-btn-primary {
  background: #1d4ed8 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 10px !important;
  font-size: 13px !important;
  padding: 0 18px !important;
  height: 40px !important;
}
.mt-6 {
  margin-top: 20px;
}
.mt-2 {
  margin-top: 8px;
}
</style>
