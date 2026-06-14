<template>
  <div class="waitlist-root">
    <!-- Background grid + glow -->
    <div class="bg-grid" aria-hidden="true" />
    <div class="bg-glow" aria-hidden="true" />

    <!-- Nav bar -->
    <header class="nav-bar">
      <div class="nav-inner">
        <div class="logo-mark w-16 h-16">
          <img src="../assets/Voima.jpeg" alt="" />
        </div>
        <span class="nav-badge">Early Access</span>
      </div>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <!-- Hero -->
      <section class="hero">
        <h1 class="hero-headline">
          Your compliance<br />
          programme,<br />
          <span class="headline-accent">visible at last.</span>
        </h1>
        <div>
          <p class="hero-description">
            Gain complete visibility into your compliance operations with real-time monitoring,
            centralized reporting, and actionable insights. Track risks, manage obligations, and
            demonstrate compliance with confidence.
          </p>
        </div>
      </section>

      <!-- Form card -->
      <section class="form-section">
        <div v-if="!submitted" class="form-card">
          <div class="form-card-header">
            <p class="form-title">Request early access</p>
            <p class="form-subtitle">
              We review every application and reach out within 3 business days.
            </p>
          </div>

          <v-form
            ref="formRef"
            v-model="formValid"
            @submit.prevent="submitForm"
            class="waitlist-form"
          >
            <!-- Company name -->
            <div class="field-group">
              <label class="field-label">Company name <span class="required">*</span></label>
              <v-text-field
                v-model="form.company_name"
                :rules="[rules.required]"
                placeholder="Acme Financial Services Ltd"
                variant="outlined"
                density="comfortable"
                bg-color="#0F1923"
                color="#4ADE80"
                base-color="#2D3F50"
                hide-details="auto"
                class="v-field-custom"
              >
                <template #prepend-inner>
                  <v-icon
                    icon="mdi-office-building-outline"
                    size="18"
                    color="#4ADE80"
                    class="mr-1"
                  />
                </template>
              </v-text-field>
            </div>

            <!-- Contact person -->
            <div class="field-group">
              <label class="field-label">Contact person <span class="required">*</span></label>
              <v-text-field
                v-model="form.contact_name"
                :rules="[rules.required]"
                placeholder="Jane Adeyemi"
                variant="outlined"
                density="comfortable"
                bg-color="#0F1923"
                color="#4ADE80"
                base-color="#2D3F50"
                hide-details="auto"
                class="v-field-custom"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-account-outline" size="18" color="#4ADE80" class="mr-1" />
                </template>
              </v-text-field>
            </div>

            <!-- Contact email -->
            <div class="field-group">
              <label class="field-label">Work email <span class="required">*</span></label>
              <v-text-field
                v-model="form.contact_email"
                :rules="[rules.required, rules.email]"
                placeholder="jane@acme.com"
                variant="outlined"
                density="comfortable"
                bg-color="#0F1923"
                color="#4ADE80"
                base-color="#2D3F50"
                hide-details="auto"
                class="v-field-custom"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-email-outline" size="18" color="#4ADE80" class="mr-1" />
                </template>
              </v-text-field>
            </div>

            <!-- Contact phone -->
            <div class="field-group">
              <label class="field-label">Phone number</label>
              <v-text-field
                v-model="form.contact_phone"
                placeholder="+234 800 000 0000"
                variant="outlined"
                density="comfortable"
                bg-color="#0F1923"
                color="#4ADE80"
                base-color="#2D3F50"
                hide-details="auto"
                class="v-field-custom"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-phone-outline" size="18" color="#4ADE80" class="mr-1" />
                </template>
              </v-text-field>
            </div>

            <!-- Nature of business -->
            <div class="field-group">
              <label class="field-label">Nature of business <span class="required">*</span></label>
              <v-select
                v-model="form.nature_of_business"
                :items="businessTypes"
                :rules="[rules.required]"
                placeholder="Select your industry"
                variant="outlined"
                density="comfortable"
                bg-color="#0F1923"
                color="#4ADE80"
                base-color="#2D3F50"
                hide-details="auto"
                class="v-field-custom"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-briefcase-outline" size="18" color="#4ADE80" class="mr-1" />
                </template>
              </v-select>
            </div>

            <!-- Regulated -->
            <div class="field-group">
              <label class="field-label"
                >Is your company regulated? <span class="required">*</span></label
              >
              <div class="regulation-toggle">
                <button
                  type="button"
                  :class="['reg-btn', form.is_regulated === true && 'reg-btn--active']"
                  @click="form.is_regulated = true"
                >
                  <v-icon
                    :icon="
                      form.is_regulated === true ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'
                    "
                    size="16"
                    class="mr-1"
                  />
                  Yes, we are regulated
                </button>
                <button
                  type="button"
                  :class="['reg-btn', form.is_regulated === false && 'reg-btn--active']"
                  @click="form.is_regulated = false"
                >
                  <v-icon
                    :icon="
                      form.is_regulated === false ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'
                    "
                    size="16"
                    class="mr-1"
                  />
                  Not yet regulated
                </button>
              </div>
              <p v-if="regulationError" class="field-error">Please select an option</p>
            </div>

            <!-- Regulator name (conditional) -->
            <Transition name="slide-down">
              <div v-if="form.is_regulated === true" class="field-group">
                <label class="field-label">Regulator / Regulatory body</label>
                <v-text-field
                  v-model="form.regulator_name"
                  placeholder="e.g. CBN, SEC, NFIU, FRC"
                  variant="outlined"
                  density="comfortable"
                  bg-color="#0F1923"
                  color="#4ADE80"
                  base-color="#2D3F50"
                  hide-details="auto"
                  class="v-field-custom"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-bank-outline" size="18" color="#4ADE80" class="mr-1" />
                  </template>
                </v-text-field>
              </div>
            </Transition>

            <!-- Service interest -->

            <!-- Description of needs -->
            <div class="field-group">
              <label class="field-label">Briefly describe your compliance needs</label>
              <v-textarea
                v-model="form.description_of_needs"
                variant="outlined"
                density="comfortable"
                bg-color="#0F1923"
                color="#4ADE80"
                base-color="#2D3F50"
                hide-details="auto"
                rows="3"
                auto-grow
                class="v-field-custom"
              />
            </div>

            <!-- Submit -->
            <div class="submit-area">
              <v-btn
                type="submit"
                :loading="loading"
                :disabled="loading"
                block
                height="52"
                class="submit-btn"
                rounded="lg"
              >
                <template #default>
                  <v-icon icon="mdi-send-outline" size="18" class="mr-2" />
                  Join the waitlist
                </template>
                <template #loader>
                  <v-progress-circular indeterminate size="20" width="2" color="#0B1219" />
                  <span class="ml-2">Submitting…</span>
                </template>
              </v-btn>
              <p class="submit-note">
                <v-icon icon="mdi-shield-lock-outline" size="13" color="#4A5568" class="mr-1" />
                Your details are never shared or sold.
              </p>
            </div>
          </v-form>
        </div>

        <!-- Success state -->
        <div v-else class="success-card">
          <div class="success-icon-wrap">
            <v-icon icon="mdi-check-circle-outline" size="48" color="#4ADE80" />
          </div>
          <h2 class="success-title">You're on the list.</h2>
          <p class="success-body">
            Thank you, <strong>{{ form.contact_name }}</strong
            >. We've received your application for <strong>{{ form.company_name }}</strong> and will
            be in touch within 3 business days.
          </p>
          <div class="success-ref">
            <v-icon icon="mdi-identifier" size="14" color="#4A5568" class="mr-1" />
            Ref: <span class="ref-num">{{ referenceNumber }}</span>
          </div>
          <button class="another-btn" @click="resetForm">Submit another application</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { createClient } from '@supabase/supabase-js'

// ── Supabase ──────────────────────────────────────────────────────────────────
// Replace with your project's URL and anon key
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── State ─────────────────────────────────────────────────────────────────────
const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)
const submitted = ref(false)
const regulationError = ref(false)
const referenceNumber = ref('')

const form = reactive({
  company_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  nature_of_business: null,
  is_regulated: null,
  regulator_name: '',
  service_package: null,
  description_of_needs: ''
})

// ── Data ──────────────────────────────────────────────────────────────────────
const businessTypes = [
  'Fintech / Payments',
  'Commercial Bank',
  'Microfinance Bank',
  'Insurance',
  'Capital Markets / Securities',
  'Asset Management',
  'Pension Fund',
  'Cryptocurrency / Virtual Assets',
  'Money Transfer / Remittance',
  'Lending / Credit',
  'Mortgage',
  'Savings & Investment',
  'BNPL',
  'Non-Governmental Organisation (NGO)',
  'Designated Non-Financial Business (DNFB)',
  'Other Financial Services',
  'Other'
]

const packages = [
  { value: 'starter', label: 'Starter', hint: 'Early-stage', icon: 'mdi-seed-outline' },
  { value: 'growth', label: 'Growth', hint: 'Scaling up', icon: 'mdi-trending-up' },
  {
    value: 'regulated',
    label: 'Regulated',
    hint: 'Licensed entity',
    icon: 'mdi-certificate-outline'
  },
  { value: 'enterprise', label: 'Enterprise', hint: 'Full service', icon: 'mdi-domain' }
]

const features = [
  {
    icon: 'mdi-file-chart-outline',
    label: 'Deliverables Centre',
    desc: 'Access every report Voima produces for you'
  },
  {
    icon: 'mdi-magnify-scan',
    label: 'Findings Tracker',
    desc: 'Track findings and close actions end-to-end'
  },
  {
    icon: 'mdi-file-document-multiple-outline',
    label: 'Document Exchange',
    desc: 'Secure two-way document sharing'
  },
  {
    icon: 'mdi-newspaper-variant-outline',
    label: 'Regulatory Intel',
    desc: 'Alerts, briefings, and guidance notes'
  },
  {
    icon: 'mdi-store-check-outline',
    label: 'Vendor Oversight',
    desc: 'Monitor third-party compliance vendors'
  },
  {
    icon: 'mdi-message-text-outline',
    label: 'Advisory Requests',
    desc: 'Ask questions and get structured responses'
  }
]

// ── Validation ────────────────────────────────────────────────────────────────
const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Enter a valid email address'
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function submitForm() {
  const { valid } = await formRef.value.validate()

  if (form.is_regulated === null) {
    regulationError.value = true
    return
  }
  regulationError.value = false

  if (!valid) return

  loading.value = true
  try {
    const { data, error } = await supabase.rpc('submit_waitlist_application', {
      p_company_name: form.company_name,
      p_contact_name: form.contact_name,
      p_contact_email: form.contact_email.toLowerCase().trim(),
      p_nature_of_business: form.nature_of_business,
      p_is_regulated: form.is_regulated,
      p_contact_phone: form.contact_phone || null,
      p_regulator_name: form.is_regulated ? form.regulator_name || null : null,
      p_service_package: form.service_package || null,
      p_description_of_needs: form.description_of_needs || null
    })

    if (error) throw error

    referenceNumber.value = data
    submitted.value = true
  } catch (err) {
    console.error(err)
    // In production replace with a toast / snackbar
    alert(err.message || 'Something went wrong. Please try again.')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    nature_of_business: null,
    is_regulated: null,
    regulator_name: '',
    service_package: null,
    description_of_needs: ''
  })
  submitted.value = false
  referenceNumber.value = ''
}
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────────────────────────────── */
.waitlist-root {
  min-height: 100vh;
  background: #060d14;
  color: #e2e8f0;
  position: relative;
  overflow-x: hidden;
}

/* ── Background ────────────────────────────────────────────────────────────── */
.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(74, 222, 128, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74, 222, 128, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
  z-index: 0;
}
.bg-glow {
  position: fixed;
  top: -200px;
  right: -200px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── Nav ───────────────────────────────────────────────────────────────────── */
.nav-bar {
  position: relative;
  z-index: 10;
  border-bottom: 1px solid rgba(74, 222, 128, 0.1);
  backdrop-filter: blur(8px);
  background: rgba(6, 13, 20, 0.8);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo-mark {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #e2e8f0;
  text-transform: uppercase;
}
.nav-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  padding: 4px 10px;
  border-radius: 20px;
}

/* ── Main layout ───────────────────────────────────────────────────────────── */
.main-content {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 20px 40px;
  }
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
.hero {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4ade80;
  margin-bottom: 24px;
}
.hero-headline {
  font-size: clamp(36px, 4.5vw, 54px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #f1f5f9;
  margin-bottom: 24px;
}
.hero-description {
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.7;
  color: #8899a6;
}
.headline-accent {
  color: #4ade80;
}
.hero-body {
  font-size: 16px;
  line-height: 1.7;
  color: #8899a6;
  margin-bottom: 40px;
}
.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(74, 222, 128, 0.15);
}
.stat-num {
  display: block;
  font-size: 26px;
  font-weight: 800;
  color: #4ade80;
  line-height: 1;
  margin-bottom: 4px;
}
.stat-label {
  display: block;
  font-size: 11px;
  color: #4a5568;
  letter-spacing: 0.04em;
}

/* ── Form card ─────────────────────────────────────────────────────────────── */
.form-card {
  background: #0b1219;
  border: 1px solid rgba(74, 222, 128, 0.12);
  border-radius: 16px;
  overflow: hidden;
}
.form-card-header {
  padding: 28px 28px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 0;
  padding-bottom: 20px;
}
.form-title {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 4px;
}
.form-subtitle {
  font-size: 13px;
  color: #4a5568;
}
.waitlist-form {
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Fields ────────────────────────────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #8899a6;
  text-transform: uppercase;
}
.required {
  color: #4ade80;
}
.field-error {
  font-size: 12px;
  color: #f87171;
  margin-top: 4px;
}

/* Vuetify field color overrides */
:deep(.v-field-custom .v-field__outline__start),
:deep(.v-field-custom .v-field__outline__end),
:deep(.v-field-custom .v-field__outline__notch) {
  border-color: #1e2e3e !important;
}
:deep(.v-field-custom .v-field__input) {
  color: #e2e8f0 !important;
  font-size: 14px;
}
:deep(.v-field-custom .v-field__input::placeholder) {
  color: #334155;
}

/* ── Regulation toggle ─────────────────────────────────────────────────────── */
.regulation-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.reg-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1e2e3e;
  background: #0f1923;
  color: #4a5568;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.reg-btn:hover {
  border-color: rgba(74, 222, 128, 0.3);
  color: #8899a6;
}
.reg-btn--active {
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.06);
  color: #4ade80;
}

/* ── Package grid ──────────────────────────────────────────────────────────── */
.package-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.pkg-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #1e2e3e;
  background: #0f1923;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}
.pkg-card:hover {
  border-color: rgba(74, 222, 128, 0.3);
}
.pkg-card--active {
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.06);
}
.pkg-icon {
  margin-bottom: 4px;
}
.pkg-name {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
}
.pkg-hint {
  font-size: 11px;
  color: #4a5568;
}

/* ── Submit ────────────────────────────────────────────────────────────────── */
.submit-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}
.submit-btn {
  background: #4ade80 !important;
  color: #060d14 !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  letter-spacing: 0.01em !important;
}
.submit-btn:hover {
  background: #22c55e !important;
}
.submit-note {
  font-size: 12px;
  color: #334155;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Success card ──────────────────────────────────────────────────────────── */
.success-card {
  background: #0b1219;
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.success-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.success-title {
  font-size: 28px;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.02em;
}
.success-body {
  font-size: 15px;
  color: #8899a6;
  line-height: 1.6;
  max-width: 340px;
}
.success-ref {
  font-size: 12px;
  color: #4a5568;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #1e2e3e;
  padding: 8px 14px;
  border-radius: 6px;
}
.ref-num {
  color: #4ade80;
  font-weight: 700;
  margin-left: 4px;
  letter-spacing: 0.08em;
}
.another-btn {
  margin-top: 8px;
  font-size: 13px;
  color: #4ade80;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Feature strip ─────────────────────────────────────────────────────────── */
.feature-strip {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.015);
  padding: 48px 24px;
}
.feature-strip-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
@media (max-width: 768px) {
  .feature-strip-inner {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .feature-strip-inner {
    grid-template-columns: 1fr;
  }
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.feature-icon {
  margin-top: 2px;
  flex-shrink: 0;
}
.feature-label {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 3px;
}
.feature-desc {
  font-size: 12px;
  color: #4a5568;
  line-height: 1.5;
}

/* ── Footer ────────────────────────────────────────────────────────────────── */
.footer {
  position: relative;
  z-index: 2;
  padding: 24px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-copy {
  font-size: 12px;
  color: #1e2e3e;
}

/* ── Transition ────────────────────────────────────────────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

