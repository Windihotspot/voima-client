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

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import MainLayout from '@/components/Layouts/MainLayout.vue'
import { useApplicantPortal } from '@/composables/useApplicationPortal'
import { useApplicantAuthStore } from '@/stores/applicationAuth'

const {
  application,
  documents,
  directors,
  loading,
  error,
  fetchMyApplication,
  getDocumentDownloadUrl
} = useApplicantPortal()

const router = useRouter()
const authStore = useApplicantAuthStore()

onMounted(async () => {
  await authStore.restoreSession()
  await fetchMyApplication()
})

// ── Snackbar ───────────────────────────────────────────────────────────
const snack = reactive({ show: false, message: '', color: 'success' })
const showSnack = (message: string, color = 'success') => {
  snack.message = message
  snack.color = color
  snack.show = true
}

async function handleLogout() {
  await authStore.logout()
  window.location.href = '/'
}

// ── Static reference data (mirrors onboarding form) ─────────────────────
const organisationTypes = [
  { label: 'Fintech', value: 'fintech' },
  { label: 'Payment Service Provider', value: 'payment_service_provider' },
  { label: 'Microfinance Institution', value: 'microfinance' },
  { label: 'Insurance Company', value: 'insurance' },
  { label: 'Crypto / Digital Asset Exchange', value: 'crypto_exchange' },
  { label: 'Asset Management', value: 'asset_management' },
  { label: 'NGO / Non-Profit', value: 'ngo' },
  { label: 'Bank', value: 'bank' },
  { label: 'Other', value: 'other' }
]

const serviceOptions = [
  {
    label: 'Compliance Operations',
    value: 'compliance_operations',
    icon: 'mdi-shield-check-outline'
  },
  { label: 'Governance & Risk', value: 'governance_risk', icon: 'mdi-scale-balance' },
  {
    label: 'Regulatory Compliance Guidance',
    value: 'regulatory_compliance_guidance',
    icon: 'mdi-bank-outline'
  },
  {
    label: 'Licensing & Authorisations',
    value: 'licensing_authorisations',
    icon: 'mdi-certificate-outline'
  },
  { label: 'Financial Crime', value: 'financial_crime', icon: 'mdi-shield-alert-outline' },
  {
    label: 'Policies & Frameworks',
    value: 'policies_frameworks',
    icon: 'mdi-file-document-edit-outline'
  },
  {
    label: 'Audit Preparation & Assurance',
    value: 'audit_preparation_assurance',
    icon: 'mdi-clipboard-check-outline'
  },
  {
    label: 'Data Protection & Cyber Security',
    value: 'data_protection_cyber_security',
    icon: 'mdi-lock-outline'
  },
  { label: 'Training & Awareness', value: 'training_awareness', icon: 'mdi-school-outline' },
  { label: 'Executive Oversight', value: 'executive_oversight', icon: 'mdi-account-tie-outline' },
  { label: 'Industry Solutions', value: 'industry_solutions', icon: 'mdi-domain' },
  {
    label: 'Compliance Infrastructure',
    value: 'compliance_infrastructure',
    icon: 'mdi-server-network-outline'
  },
  { label: 'Vendor Management', value: 'vendor_management', icon: 'mdi-storefront-outline' }
]

const transactionBands = [
  'Under 500',
  '500 – 1,000',
  '1,000 – 5,000',
  '5,000 – 20,000',
  '20,000 – 50,000',
  'Over 50,000'
]

const countries = [
  { title: 'United Kingdom', code: '+44' },
  { title: 'United States', code: '+1' },
  { title: 'Nigeria', code: '+234' },
  { title: 'Ghana', code: '+233' },
  { title: 'Kenya', code: '+254' },
  { title: 'Canada', code: '+1' },
  { title: 'Rwanda', code: '+250' }
]

const requiredDocs = [
  {
    key: 'certificate_of_incorporation',
    label: 'Certificate of Incorporation',
    icon: 'mdi-certificate-outline',
    required: true
  },
  {
    key: 'memorandum_articles',
    label: 'Memorandum & Articles of Association',
    icon: 'mdi-file-document-outline',
    required: true
  },
  {
    key: 'aml_cft_policy',
    label: 'AML/CFT Policy',
    icon: 'mdi-shield-lock-outline',
    required: false
  },
  { key: 'kyc_policy', label: 'KYC Policy', icon: 'mdi-account-check-outline', required: false },
  {
    key: 'regulatory_license',
    label: 'Regulatory License',
    icon: 'mdi-bank-outline',
    required: false
  },
  { key: 'board_resolution', label: 'Board Resolution', icon: 'mdi-gavel', required: false },
  {
    key: 'latest_audited_accounts',
    label: 'Latest Audited Accounts',
    icon: 'mdi-chart-bar',
    required: false
  },
  {
    key: 'organizational_chart',
    label: 'Organisational Chart',
    icon: 'mdi-sitemap-outline',
    required: false
  }
]

// ── Validation rules ─────────────────────────────────────────────────────
const required = (v: any) =>
  (v !== null && v !== undefined && String(v).trim() !== '') || 'Required'
const emailRule = (v: any) => !v || /.+@.+\..+/.test(v) || 'Invalid email'
const phoneRule = (v: any) => !v || /^\+?[\d\s\-]{7,}$/.test(v) || 'Invalid phone number'
const dateRule = (v: any) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Use YYYY-MM-DD format'
const formatDate = (date: any) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ── Documents keyed by type for quick lookup ────────────────────────────
const docsByType = computed(() => {
  const map: Record<string, any> = {}
  for (const d of documents.value) map[d.doc_type] = d
  return map
})

const uploadedDocsCount = computed(() => documents.value.length)
const allRequiredDocsUploaded = computed(() =>
  requiredDocs.filter((d) => d.required).every((d) => docsByType.value[d.key])
)

// ── Shared: send full application payload to upsert_onboarding_application
async function persistApplication(patch: Record<string, any>) {
  if (!application.value) return
  const merged = { ...application.value, ...patch }

  const payload = {
    p_id: merged.id,
    p_company_name: merged.company_name || null,
    p_trading_name: merged.trading_name || null,
    p_organisation_type: merged.organisation_type || null,
    p_registration_number: merged.registration_number || null,
    p_registration_country: merged.registration_country,
    p_date_of_incorporation: merged.date_of_incorporation || null,
    p_website: merged.website || null,
    p_industry_description: merged.industry_description || null,
    p_is_regulated: merged.is_regulated ?? false,
    p_regulator_name: merged.regulator_name || null,
    p_regulatory_license_number: merged.regulatory_license_number || null,
    p_license_expiry_date: merged.license_expiry_date || null,
    p_contact_full_name: merged.contact_full_name || null,
    p_contact_job_title: merged.contact_job_title || null,
    p_contact_email: merged.contact_email || null,
    p_contact_phone: merged.contact_phone || null,
    p_registered_address: merged.registered_address || null,
    p_operating_address: merged.operating_address || null,
    p_city: merged.city || null,
    p_country: merged.country,
    p_service_package: merged.service_package || null,
    p_service_interest: merged.service_interest?.length ? merged.service_interest : null,
    p_description_of_needs: merged.description_of_needs || null,
    p_has_existing_compliance_program: merged.has_existing_compliance_program,
    p_existing_compliance_notes: merged.existing_compliance_notes || null,
    p_estimated_monthly_transactions: merged.estimated_monthly_transactions || null,
    p_customer_base_description: merged.customer_base_description || null
  }

  const { error: rpcError } = await supabase.rpc('upsert_onboarding_application', payload)
  if (rpcError) throw rpcError

  application.value = merged
}

// ── Company details dialog ───────────────────────────────────────────────
const companyDialog = ref(false)
const companySaving = ref(false)
const companyDraft = reactive({
  company_name: '',
  trading_name: '',
  organisation_type: null as string | null,
  registration_number: '',
  registration_country: '',
  date_of_incorporation: '',
  website: '',
  industry_description: '',
  is_regulated: false,
  regulator_name: '',
  regulatory_license_number: '',
  license_expiry_date: ''
})
const incorporationMenu = ref(false)
const licenseExpiryMenu = ref(false)
const companyForm = ref<any>(null)

function openCompanyDialog() {
  if (!application.value) return
  Object.assign(companyDraft, {
    company_name: application.value.company_name,
    trading_name: application.value.trading_name,
    organisation_type: application.value.organisation_type,
    registration_number: application.value.registration_number,
    registration_country: application.value.registration_country,
    date_of_incorporation: application.value.date_of_incorporation,
    website: application.value.website,
    industry_description: application.value.industry_description,
    is_regulated: application.value.is_regulated,
    regulator_name: application.value.regulator_name,
    regulatory_license_number: application.value.regulatory_license_number,
    license_expiry_date: application.value.license_expiry_date
  })
  companyDialog.value = true
}

async function saveCompanyDialog() {
  const { valid } = await companyForm.value.validate()
  if (!valid) return
  companySaving.value = true
  try {
    await persistApplication({ ...companyDraft })
    companyDialog.value = false
    showSnack('Company details updated')
  } catch (err: any) {
    showSnack('Update failed: ' + err.message, 'error')
  } finally {
    companySaving.value = false
  }
}

// ── Contact & address dialog ─────────────────────────────────────────────
const contactDialog = ref(false)
const contactSaving = ref(false)
const contactDraft = reactive({
  contact_full_name: '',
  contact_job_title: '',
  contact_email: '',
  contact_phone: '',
  registered_address: '',
  operating_address: '',
  city: '',
  country: ''
})
const contactForm = ref<any>(null)

function openContactDialog() {
  if (!application.value) return
  Object.assign(contactDraft, {
    contact_full_name: application.value.contact_full_name,
    contact_job_title: application.value.contact_job_title,
    contact_email: application.value.contact_email,
    contact_phone: application.value.contact_phone,
    registered_address: application.value.registered_address,
    operating_address: application.value.operating_address,
    city: application.value.city,
    country: application.value.country
  })
  contactDialog.value = true
}

async function saveContactDialog() {
  const { valid } = await contactForm.value.validate()
  if (!valid) return
  contactSaving.value = true
  try {
    await persistApplication({ ...contactDraft })
    contactDialog.value = false
    showSnack('Contact details updated')
  } catch (err: any) {
    showSnack('Update failed: ' + err.message, 'error')
  } finally {
    contactSaving.value = false
  }
}

// ── Service & compliance dialog ──────────────────────────────────────────
const serviceDialog = ref(false)
const serviceSaving = ref(false)
const serviceDraft = reactive({
  service_interest: [] as string[],
  description_of_needs: '',
  has_existing_compliance_program: false,
  existing_compliance_notes: '',
  estimated_monthly_transactions: '',
  customer_base_description: ''
})
const serviceForm = ref<any>(null)

function openServiceDialog() {
  if (!application.value) return
  Object.assign(serviceDraft, {
    service_interest: [...(application.value.service_interest || [])],
    description_of_needs: application.value.description_of_needs,
    has_existing_compliance_program: application.value.has_existing_compliance_program,
    existing_compliance_notes: application.value.existing_compliance_notes,
    estimated_monthly_transactions: application.value.estimated_monthly_transactions,
    customer_base_description: application.value.customer_base_description
  })
  serviceDialog.value = true
}

function toggleServiceDraft(val: string) {
  const i = serviceDraft.service_interest.indexOf(val)
  if (i === -1) serviceDraft.service_interest.push(val)
  else serviceDraft.service_interest.splice(i, 1)
}

async function saveServiceDialog() {
  const { valid } = await serviceForm.value.validate()
  if (!valid) return
  serviceSaving.value = true
  try {
    await persistApplication({ ...serviceDraft })
    serviceDialog.value = false
    showSnack('Service details updated')
  } catch (err: any) {
    showSnack('Update failed: ' + err.message, 'error')
  } finally {
    serviceSaving.value = false
  }
}

// ── Directors dialog (add / edit) ────────────────────────────────────────
const directorDialog = ref(false)
const directorSaving = ref(false)
const editingDirectorIndex = ref<number | null>(null)
const directorMenu = ref(false)
const directorForm = ref<any>(null)
const directorDraft = reactive({
  id: null as string | null,
  full_name: '',
  job_title: '',
  nationality: '',
  date_of_birth: '',
  id_type: '',
  id_number: '',
  email: '',
  is_ubo: false,
  ownership_percent: null as number | null
})

function openDirectorDialog(index: number | null = null) {
  editingDirectorIndex.value = index
  if (index !== null) {
    Object.assign(directorDraft, directors.value[index])
  } else {
    Object.assign(directorDraft, {
      id: null,
      full_name: '',
      job_title: '',
      nationality: '',
      date_of_birth: '',
      id_type: '',
      id_number: '',
      email: '',
      is_ubo: false,
      ownership_percent: null
    })
  }
  directorDialog.value = true
}

const initials = (name: string) => {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

async function saveDirectorDialog() {
  const { valid } = await directorForm.value.validate()
  if (!valid) return
  if (!application.value) return

  directorSaving.value = true
  try {
    const payload = {
      p_id: directorDraft.id || null,
      p_application_id: application.value.id,
      p_full_name: directorDraft.full_name,
      p_job_title: directorDraft.job_title || null,
      p_nationality: directorDraft.nationality || null,
      p_date_of_birth: directorDraft.date_of_birth || null,
      p_id_type: directorDraft.id_type || null,
      p_id_number: directorDraft.id_number || null,
      p_email: directorDraft.email || null,
      p_is_ubo: directorDraft.is_ubo,
      p_ownership_percent: directorDraft.ownership_percent || null
    }
    const { data, error: rpcError } = await supabase.rpc('upsert_onboarding_director', payload)
    if (rpcError) throw rpcError

    const saved = { ...directorDraft, id: data }
    if (editingDirectorIndex.value !== null) {
      directors.value[editingDirectorIndex.value] = saved
    } else {
      directors.value.push(saved)
    }
    directorDialog.value = false
    showSnack('Director saved')
  } catch (err: any) {
    showSnack('Save failed: ' + err.message, 'error')
  } finally {
    directorSaving.value = false
  }
}

// ── Document replace ──────────────────────────────────────────────────────
const fileInputs = reactive<Record<string, any>>({})
const uploading = reactive<Record<string, boolean>>({})
const uploadErrors = reactive<Record<string, string>>({})

const triggerFile = (key: string) => fileInputs[key]?.click()

async function handleFile(event: Event, docType: string) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !application.value) return

  if (file.size > 10 * 1024 * 1024) {
    uploadErrors[docType] = 'File too large. Max 10MB.'
    return
  }
  delete uploadErrors[docType]
  uploading[docType] = true

  try {
    const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')

    const { data: rpcData, error: rpcError } = await supabase.rpc('upload_onboarding_document', {
      p_application_id: application.value.id,
      p_doc_type: docType,
      p_file_name: safeName,
      p_mime_type: file.type,
      p_file_size_bytes: file.size
    })
    if (rpcError) throw rpcError

    const { storagePath, bucket, documentId } = rpcData

    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket || 'onboarding-documents')
      .createSignedUploadUrl(storagePath)
    if (signedError) throw signedError

    const res = await fetch(signedData.signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    })
    if (!res.ok) throw new Error('Storage upload failed')

    const { error: confirmError } = await supabase.rpc('confirm_onboarding_document_upload', {
      p_document_id: documentId,
      p_storage_path: storagePath
    })
    if (confirmError) throw confirmError

    await fetchMyApplication()
    showSnack('Document updated')
  } catch (err: any) {
    uploadErrors[docType] = 'Upload failed: ' + err.message
    showSnack('Upload failed: ' + err.message, 'error')
  } finally {
    uploading[docType] = false
    target.value = ''
  }
}

async function viewDocument(filePath: string | null) {
  if (!filePath) return
  try {
    const url = await getDocumentDownloadUrl(filePath)
    window.open(url, '_blank', 'noopener,noreferrer')
  } catch (err: any) {
    showSnack('Could not open document: ' + err.message, 'error')
  }
}

// ── Display helpers ───────────────────────────────────────────────────────
const statusMeta = computed(() => {
  const status = application.value?.status || 'draft'
  const map: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: '#64748b', bg: '#f1f5f9' },
    submitted: { label: 'Submitted', color: '#2563eb', bg: '#eff6ff' },
    under_review: { label: 'Under Review', color: '#d97706', bg: '#fffbeb' },
    approved: { label: 'Approved', color: '#16a34a', bg: '#f0fdf4' },
    rejected: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2' }
  }
  return map[status] || map.draft
})

const orgTypeLabel = computed(
  () =>
    organisationTypes.find((o) => o.value === application.value?.organisation_type)?.label ||
    application.value?.organisation_type
)

const serviceLabel = (val: string) => serviceOptions.find((s) => s.value === val)?.label || val
</script>

<template>
  <MainLayout>
    <div class="ch-screen">
      <!-- ── Top bar ── -->
      <header class="ch-topbar">
        <div class="ch-topbar-inner">
          <div class="ch-brand">
            <v-icon icon="mdi-shield-check" size="22" color="#2563eb" />
            <span>Voima Command Center</span>
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
          <p>Loading profile…</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="ch-error">
          <v-icon size="36" color="#dc2626">mdi-alert-circle-outline</v-icon>
          <p>{{ error }}</p>
          <v-btn size="small" variant="tonal" color="#2563eb" @click="fetchMyApplication"
            >Retry</v-btn
          >
        </div>

        <!-- Empty -->
        <div v-else-if="!application" class="ch-empty">
          <div class="ch-empty-icon">
            <v-icon size="32" color="#94a3b8">mdi-file-document-outline</v-icon>
          </div>
          <div class="ch-empty-title">No application found</div>
          <div class="ch-empty-sub">
            We couldn't find an onboarding application linked to your account.
          </div>
        </div>

        <template v-else>
          <!-- ── Page head ── -->
          <div class="ch-page-head">
            <div class="ch-page-head-left">
              <div class="ch-page-eyebrow">{{ application.reference_number }}</div>
              <h1 class="ch-page-title">{{ application.company_name }}</h1>
              <div class="ch-page-sub">{{ application.trading_name || orgTypeLabel }}</div>
            </div>
            <div class="ch-page-head-right">
              <span
                class="ch-status-pill"
                :style="{
                  color: statusMeta.color,
                  background: statusMeta.bg,
                  borderColor: statusMeta.color + '55'
                }"
              >
                <span class="ch-status-dot" :style="{ background: statusMeta.color }" />
                {{ statusMeta.label }}
              </span>
            </div>
          </div>

          <!-- ── KPI strip ── -->
          <div class="ch-kpi-strip">
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #eff6ff">
                <v-icon size="18" color="#2563eb">mdi-file-multiple-outline</v-icon>
              </div>
              <div>
                <div class="ch-kpi-value">{{ uploadedDocsCount }}</div>
                <div class="ch-kpi-label">Documents on file</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #f0fdf4">
                <v-icon size="18" color="#16a34a">mdi-account-multiple-outline</v-icon>
              </div>
              <div>
                <div class="ch-kpi-value">{{ directors.length }}</div>
                <div class="ch-kpi-label">Directors / UBOs</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #fffbeb">
                <v-icon size="18" color="#d97706">mdi-shield-check-outline</v-icon>
              </div>
              <div>
                <div class="ch-kpi-value">{{ (application.service_interest || []).length }}</div>
                <div class="ch-kpi-label">Service areas</div>
              </div>
            </div>
            <div class="ch-kpi-card">
              <div class="ch-kpi-icon" style="background: #fef2f2">
                <v-icon size="18" color="#dc2626">mdi-bank-outline</v-icon>
              </div>
              <div>
                <div class="ch-kpi-value">{{ application.is_regulated ? 'Yes' : 'No' }}</div>
                <div class="ch-kpi-label">Regulated entity</div>
              </div>
            </div>
          </div>

          <!-- ── Company + Contact ── -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            <!-- Company Details -->
            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <i class="fa-solid fa-building text-blue-600"></i>
                  Company Details
                </span>
                <button
                  @click="openCompanyDialog"
                  class="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
              </div>

              <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-signature text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Legal Name
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.company_name }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.trading_name"
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-tag text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Trading As
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.trading_name }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-layer-group text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Type
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ orgTypeLabel }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.registration_number"
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-hashtag text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      RC Number
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.registration_number }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-earth-africa text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Country
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.registration_country }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.date_of_incorporation"
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-calendar-days text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Incorporated
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.date_of_incorporation }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.website"
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-globe text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Website
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.website }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl p-3 border"
                  :class="
                    application.is_regulated
                      ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-slate-50 border-slate-100'
                  "
                >
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="
                      application.is_regulated
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-200 text-slate-500'
                    "
                  >
                    <i class="fa-solid fa-shield-halved text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Regulated
                    </div>
                    <div
                      class="text-sm font-semibold"
                      :class="application.is_regulated ? 'text-emerald-700' : 'text-slate-900'"
                    >
                      {{ application.is_regulated ? 'Yes' : 'No' }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.is_regulated && application.regulator_name"
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-gavel text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Regulator
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.regulator_name }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.industry_description"
                  class="sm:col-span-2 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-briefcase text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Activities
                    </div>
                    <div class="text-sm text-slate-700 leading-relaxed">
                      {{ application.industry_description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact & Address -->
            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <i class="fa-solid fa-address-card text-blue-600"></i>
                  Contact & Address
                </span>
                <button
                  @click="openContactDialog"
                  class="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
              </div>

              <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-user text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Name
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.contact_full_name }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.contact_job_title"
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-id-badge text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Title
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.contact_job_title }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-envelope text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.contact_email }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-phone text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.contact_phone }}
                    </div>
                  </div>
                </div>

                <div
                  class="sm:col-span-2 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-location-dot text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Registered Address
                    </div>
                    <div class="text-sm font-semibold text-slate-900">
                      {{ application.registered_address }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.operating_address"
                  class="sm:col-span-2 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-map-pin text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Operating Address
                    </div>
                    <div class="text-sm font-semibold text-slate-900">
                      {{ application.operating_address }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-city text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      City
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.city }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-flag text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Country
                    </div>
                    <div class="text-sm font-semibold text-slate-900 truncate">
                      {{ application.country }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Service & Compliance ── -->
          <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
                <i class="fa-solid fa-shield-check text-blue-600"></i>
                Service & Compliance
              </span>
              <button
                @click="openServiceDialog"
                class="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <i class="fa-solid fa-pen text-xs"></i>
              </button>
            </div>

            <div class="p-5">
              <!-- Service area chips -->
              <div class="mb-5">
                <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Areas of Service
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="svc in application.service_interest"
                    :key="svc"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5"
                  >
                    <i class="fa-solid fa-check text-[10px]"></i>
                    {{ serviceLabel(svc) }}
                  </span>
                </div>
              </div>

              <!-- Distinct data points -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-if="application.description_of_needs"
                  class="sm:col-span-2 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-comment-dots text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Needs
                    </div>
                    <div class="text-sm text-slate-700 leading-relaxed">
                      {{ application.description_of_needs }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-xl p-3 border"
                  :class="
                    application.has_existing_compliance_program
                      ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-slate-50 border-slate-100'
                  "
                >
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="
                      application.has_existing_compliance_program
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-200 text-slate-500'
                    "
                  >
                    <i class="fa-solid fa-clipboard-check text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Existing Programme
                    </div>
                    <div
                      class="text-sm font-semibold"
                      :class="
                        application.has_existing_compliance_program
                          ? 'text-emerald-700'
                          : 'text-slate-900'
                      "
                    >
                      {{ application.has_existing_compliance_program ? 'Yes' : 'No' }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.estimated_monthly_transactions"
                  class="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-chart-line text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Monthly Transactions
                    </div>
                    <div class="text-sm font-semibold text-slate-900">
                      {{ application.estimated_monthly_transactions }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.existing_compliance_notes"
                  class="sm:col-span-2 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-note-sticky text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Notes
                    </div>
                    <div class="text-sm text-slate-700 leading-relaxed">
                      {{ application.existing_compliance_notes }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="application.customer_base_description"
                  class="sm:col-span-2 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fa-solid fa-users text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Customer Base
                    </div>
                    <div class="text-sm text-slate-700 leading-relaxed">
                      {{ application.customer_base_description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- ── Directors ── -->
          <div class="ch-card mt-6">
            <div class="ch-card-head flex items-center justify-between">
              <span class="ch-card-title">Directors & Beneficial Owners</span>

              <v-btn size="small" variant="tonal" color="#2563eb" @click="openDirectorDialog()">
                <v-icon start size="15">mdi-plus</v-icon>
                Add Director
              </v-btn>
            </div>
            <div class="ch-card-body">
              <div v-if="directors.length === 0" class="ch-chart-empty">
                No directors on file yet.
              </div>
              <div class="director-cards" v-else>
                <div
                  v-for="(dir, i) in directors"
                  :key="dir.id"
                  class="director-card"
                  :class="{ ubo: dir.is_ubo }"
                >
                  <div class="director-card-head">
                    <div class="director-avatar">{{ initials(dir.full_name) }}</div>
                    <div class="director-meta">
                      <div class="director-name">{{ dir.full_name }}</div>
                      <div class="director-title">{{ dir.job_title }} · {{ dir.nationality }}</div>
                    </div>
                    <div class="director-badges">
                      <span class="dir-badge ubo-badge" v-if="dir.is_ubo"
                        >UBO {{ dir.ownership_percent }}%</span
                      >
                      <span class="dir-badge">Director</span>
                    </div>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="#0f172a"
                      @click="openDirectorDialog(i)"
                    >
                      <v-icon>mdi-pencil-outline</v-icon>
                    </v-btn>
                    <v-tooltip
                      text="Deleting a director isn't wired up yet — needs a delete RPC on the backend."
                    >
                      <template #activator="{ props }">
                        <v-btn
                          icon
                          size="x-small"
                          variant="text"
                          color="#94a3b8"
                          disabled
                          v-bind="props"
                        >
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Documents ── -->
          <div class="ch-card mt-6">
            <div class="ch-card-head">
              <span class="ch-card-title">Documents</span>
              <span class="ch-card-sub">{{ uploadedDocsCount }} on file</span>
            </div>
            <div class="ch-card-body doc-grid">
              <div
                v-for="doc in requiredDocs"
                :key="doc.key"
                class="doc-card"
                :class="{
                  uploaded: docsByType[doc.key],
                  error: uploadErrors[doc.key],
                  uploading: uploading[doc.key]
                }"
              >
                <div class="doc-card-left">
                  <div class="doc-icon-wrap">
                    <v-icon size="22" :color="docsByType[doc.key] ? '#0f172a' : '#64748b'">{{
                      doc.icon
                    }}</v-icon>
                  </div>
                  <div class="doc-info">
                    <div class="doc-name">
                      {{ doc.label }}
                      <span class="ch-req" v-if="doc.required" style="color: #dc2626">*</span>
                    </div>
                    <div class="doc-uploaded-name" v-if="docsByType[doc.key]">
                      <v-icon size="12" color="#16a34a">mdi-check-circle</v-icon>
                      {{ docsByType[doc.key].file_name }}
                    </div>
                    <div v-else class="doc-hint">Not uploaded yet</div>
                    <div class="doc-error" v-if="uploadErrors[doc.key]">
                      {{ uploadErrors[doc.key] }}
                    </div>
                  </div>
                </div>
                <div class="doc-card-right" style="display: flex; gap: 6px">
                  <v-btn
                    v-if="docsByType[doc.key]"
                    size="small"
                    variant="text"
                    color="#2563eb"
                    @click="viewDocument(docsByType[doc.key].file_path)"
                    >View</v-btn
                  >
                  <v-btn
                    size="small"
                    variant="tonal"
                    :color="docsByType[doc.key] ? '#0f172a' : '#334155'"
                    :loading="uploading[doc.key]"
                    @click="triggerFile(doc.key)"
                    >{{ docsByType[doc.key] ? 'Replace' : 'Upload' }}</v-btn
                  >
                  <input
                    :ref="(el) => (fileInputs[doc.key] = el)"
                    type="file"
                    accept="image/*,.pdf"
                    style="display: none"
                    @change="handleFile($event, doc.key)"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>

    <!-- ── Company dialog ── -->
    <v-dialog v-model="companyDialog" max-width="640">
      <v-card>
        <v-card-title>Edit Company Details</v-card-title>
        <v-card-text>
          <v-form ref="companyForm" @submit.prevent>
            <v-text-field
              v-model="companyDraft.company_name"
              label="Legal Company Name"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="companyDraft.trading_name"
              label="Trading Name"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-select
              v-model="companyDraft.organisation_type"
              :items="organisationTypes"
              item-title="label"
              item-value="value"
              label="Organisation Type"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="companyDraft.registration_number"
              label="Registration Number"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-select
              v-model="companyDraft.registration_country"
              :items="countries.map((c) => c.title)"
              label="Country of Registration"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-menu v-model="incorporationMenu" :close-on-content-click="false">
              <template #activator="{ props }">
                <v-text-field
                  v-model="companyDraft.date_of_incorporation"
                  label="Date of Incorporation"
                  readonly
                  v-bind="props"
                  :rules="[dateRule]"
                  variant="outlined"
                  density="comfortable"
                  class="mb-2"
                />
              </template>
              <v-date-picker
                :model-value="companyDraft.date_of_incorporation"
                @update:model-value="
                  (v) => {
                    companyDraft.date_of_incorporation = formatDate(v)
                    incorporationMenu = false
                  }
                "
              />
            </v-menu>
            <v-text-field
              v-model="companyDraft.website"
              label="Website"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-textarea
              v-model="companyDraft.industry_description"
              label="Business Activities"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              rows="3"
              class="mb-2"
            />
            <v-radio-group v-model="companyDraft.is_regulated" inline hide-details>
              <v-radio label="Regulated" :value="true" />
              <v-radio label="Not regulated" :value="false" />
            </v-radio-group>
            <template v-if="companyDraft.is_regulated">
              <v-text-field
                v-model="companyDraft.regulator_name"
                label="Regulator"
                variant="outlined"
                density="comfortable"
                class="mb-2 mt-2"
              />
              <v-text-field
                v-model="companyDraft.regulatory_license_number"
                label="License Number"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
              <v-menu v-model="licenseExpiryMenu" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-text-field
                    v-model="companyDraft.license_expiry_date"
                    label="License Expiry"
                    readonly
                    v-bind="props"
                    :rules="[dateRule]"
                    variant="outlined"
                    density="comfortable"
                  />
                </template>
                <v-date-picker
                  :model-value="companyDraft.license_expiry_date"
                  @update:model-value="
                    (v) => {
                      companyDraft.license_expiry_date = formatDate(v)
                      licenseExpiryMenu = false
                    }
                  "
                />
              </v-menu>
            </template>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="companyDialog = false">Cancel</v-btn>
          <v-btn color="#2563eb" variant="flat" :loading="companySaving" @click="saveCompanyDialog"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Contact dialog ── -->
    <v-dialog v-model="contactDialog" max-width="600">
      <v-card>
        <v-card-title>Edit Contact & Address</v-card-title>
        <v-card-text>
          <v-form ref="contactForm" @submit.prevent>
            <v-text-field
              v-model="contactDraft.contact_full_name"
              label="Full Name"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="contactDraft.contact_job_title"
              label="Job Title"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="contactDraft.contact_email"
              label="Email"
              :rules="[required, emailRule]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="contactDraft.contact_phone"
              label="Phone"
              :rules="[required, phoneRule]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="contactDraft.registered_address"
              label="Registered Address"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="contactDraft.operating_address"
              label="Operating Address"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="contactDraft.city"
              label="City"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-select
              v-model="contactDraft.country"
              :items="countries.map((c) => c.title)"
              label="Country"
              variant="outlined"
              density="comfortable"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="contactDialog = false">Cancel</v-btn>
          <v-btn color="#2563eb" variant="flat" :loading="contactSaving" @click="saveContactDialog"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Service dialog ── -->
    <v-dialog v-model="serviceDialog" max-width="640">
      <v-card>
        <v-card-title>Edit Service & Compliance</v-card-title>
        <v-card-text>
          <v-form ref="serviceForm" @submit.prevent>
            <div class="ch-card-title mb-2">Areas of Service Required</div>
            <div class="service-chips mb-4">
              <div
                v-for="svc in serviceOptions"
                :key="svc.value"
                class="service-chip"
                :class="{ selected: serviceDraft.service_interest.includes(svc.value) }"
                @click="toggleServiceDraft(svc.value)"
              >
                <v-icon size="15">{{ svc.icon }}</v-icon>
                {{ svc.label }}
              </div>
            </div>
            <v-textarea
              v-model="serviceDraft.description_of_needs"
              label="Compliance Needs"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              rows="3"
              class="mb-2"
            />
            <v-radio-group
              v-model="serviceDraft.has_existing_compliance_program"
              inline
              hide-details
            >
              <v-radio label="Has existing programme" :value="true" />
              <v-radio label="Starting from scratch" :value="false" />
            </v-radio-group>
            <v-textarea
              v-if="serviceDraft.has_existing_compliance_program"
              v-model="serviceDraft.existing_compliance_notes"
              label="Current compliance setup"
              variant="outlined"
              density="comfortable"
              rows="2"
              class="mb-2 mt-2"
            />
            <v-select
              v-model="serviceDraft.estimated_monthly_transactions"
              :items="transactionBands"
              label="Estimated Monthly Transactions"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-textarea
              v-model="serviceDraft.customer_base_description"
              label="Customer / User Base"
              variant="outlined"
              density="comfortable"
              rows="2"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="serviceDialog = false">Cancel</v-btn>
          <v-btn color="#2563eb" variant="flat" :loading="serviceSaving" @click="saveServiceDialog"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Director dialog ── -->
    <v-dialog v-model="directorDialog" max-width="580">
      <v-card>
        <v-card-title
          >{{ editingDirectorIndex !== null ? 'Edit' : 'Add' }} Director / UBO</v-card-title
        >
        <v-card-text>
          <v-form ref="directorForm" @submit.prevent>
            <v-text-field
              v-model="directorDraft.full_name"
              label="Full Name"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="directorDraft.job_title"
              label="Job Title"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-select
              v-model="directorDraft.nationality"
              :items="countries.map((c) => c.title)"
              label="Nationality"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-menu v-model="directorMenu" :close-on-content-click="false">
              <template #activator="{ props }">
                <v-text-field
                  v-model="directorDraft.date_of_birth"
                  label="Date of Birth"
                  readonly
                  v-bind="props"
                  :rules="[dateRule]"
                  variant="outlined"
                  density="comfortable"
                  class="mb-2"
                />
              </template>
              <v-date-picker
                :model-value="directorDraft.date_of_birth"
                @update:model-value="
                  (v) => {
                    directorDraft.date_of_birth = formatDate(v)
                    directorMenu = false
                  }
                "
              />
            </v-menu>
            <v-select
              v-model="directorDraft.id_type"
              :items="['International Passport', 'National ID', `Driver's Licence`]"
              label="ID Type"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="directorDraft.id_number"
              label="ID Number"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="directorDraft.email"
              label="Email"
              :rules="[emailRule]"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-checkbox
              v-model="directorDraft.is_ubo"
              label="Ultimate Beneficial Owner (UBO)"
              hide-details
            />
            <v-text-field
              v-if="directorDraft.is_ubo"
              v-model.number="directorDraft.ownership_percent"
              label="Ownership Percentage (%)"
              type="number"
              :rules="[required]"
              variant="outlined"
              density="comfortable"
              style="max-width: 200px"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="directorDialog = false">Cancel</v-btn>
          <v-btn
            color="#2563eb"
            variant="flat"
            :loading="directorSaving"
            @click="saveDirectorDialog"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :color="snack.color" :timeout="4000" location="bottom right">
      {{ snack.message }}
      <template #actions>
        <v-btn variant="text" @click="snack.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </MainLayout>
</template>

<style scoped>
/* keep all your existing .ch-* styles from ComplianceProfile.vue here (topbar, kpi strip, card, etc.) */
/* plus these two blocks pulled from the onboarding page, unchanged: */
.v-btn {
  text-transform: none;
}
.director-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.director-card {
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
}
.director-card.ubo {
  border-color: rgba(37, 99, 235, 0.3);
  background: #eff6ff;
}
.director-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.director-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #fff;
  font-weight: 800;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.director-meta {
  flex: 1;
  min-width: 0;
}
.director-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}
.director-title {
  font-size: 12px;
  color: #64748b;
}
.director-badges {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.dir-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  background: #e2e8f0;
  color: #64748b;
}
.dir-badge.ubo-badge {
  background: #dbeafe;
  color: #2563eb;
}

.doc-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.doc-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
}
.doc-card.uploaded {
  border-color: rgba(22, 163, 74, 0.35);
  background: #f0fdf4;
}
.doc-card.error {
  border-color: rgba(220, 38, 38, 0.35);
  background: #fef2f2;
}
.doc-card-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.doc-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.doc-info {
  flex: 1;
  min-width: 0;
}
.doc-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
.doc-hint {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}
.doc-uploaded-name {
  font-size: 11px;
  color: #16a34a;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.doc-error {
  font-size: 11px;
  color: #dc2626;
  margin-top: 4px;
}

.service-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.service-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  border: 1.5px solid #cbd5e1;
  color: #64748b;
  cursor: pointer;
  background: #f8fafc;
  user-select: none;
  transition: all 0.2s;
}
.service-chip:hover {
  border-color: #2563eb;
}
.service-chip.selected {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
}
</style>
