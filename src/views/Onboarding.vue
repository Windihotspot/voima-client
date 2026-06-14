<template>
  <v-app class="voima-app" theme="light">
    <!-- ── Disclaimer Dialog ── -->
    <v-dialog v-model="showDisclaimer" max-width="620" persistent>
      <v-card class="disclaimer-card">
        <div class="disclaimer-header">
          <div class="disclaimer-badge">Client Onboarding</div>
        </div>
        <div class="disclaimer-body" ref="disclaimerBody" @scroll="handleDisclaimerScroll">
          <h3 class="disclaimer-title">Before You Begin</h3>
          <p class="disclaimer-text">
            This secure portal allows your organisation to apply for Voima's Compliance as a Service
            (CaaS) offering. The information you provide will be used exclusively for compliance
            assessment and client onboarding purposes.
          </p>
          <p class="disclaimer-text mt-3">
            Please have the following documents ready before proceeding:
          </p>
          <ul class="disclaimer-list">
            <li>Certificate of Incorporation</li>
            <li>Memorandum &amp; Articles of Association</li>
            <li>Board Resolution (if applicable)</li>
            <li>Regulatory License (if regulated)</li>
            <li>AML/CFT Policy document</li>
            <li>Valid ID for each Director / UBO</li>
          </ul>
          <div class="disclaimer-divider" />
          <p class="disclaimer-legal">
            By proceeding, you confirm that you are authorised to submit this application on behalf
            of your organisation, and that all information provided is accurate and complete to the
            best of your knowledge. Voima CaaS Limited reserves the right to request additional
            information during the review process.
          </p>
        </div>
        <div class="disclaimer-footer">
          <span class="disclaimer-scroll-hint" v-if="!disclaimerScrolled"> ↓ Scroll to read </span>
          <v-btn
            class="voima-btn-primary"
            :disabled="!disclaimerScrolled"
            @click="acceptDisclaimer"
            elevation="0"
          >
            I Understand — Begin Application
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- ── Success Dialog ── -->
    <v-dialog v-model="showSuccess" max-width="520" persistent>
      <v-card class="success-card">
        <div class="success-icon-wrap">
          <div class="success-ring">
            <v-icon size="40" color="white">mdi-check-bold</v-icon>
          </div>
        </div>
        <div class="success-title">Application Submitted</div>
        <div class="success-sub">Your onboarding application has been received.</div>
        <div class="ref-box">
          <div class="ref-label">Reference Number</div>
          <div class="ref-value">{{ submittedRef }}</div>
        </div>
        <p class="success-hint">
          A member of the Voima team will review your application and be in touch within
          <strong>1–3 business days</strong>. Please save your reference number for follow-up
          enquiries.
        </p>
        <v-btn class="voima-btn-primary mt-4" @click="resetForm" elevation="0">
          Submit Another Application
        </v-btn>
      </v-card>
    </v-dialog>

    <div class="onboarding-root">
      <!-- ── Header ── -->
      <div class="ob-header">
        <div class="ob-header-inner">
          <div class="ob-header-title">Client Onboarding</div>
          <div class="ob-header-right">
            <div class="ob-save-indicator" v-if="saving">
              <v-progress-circular size="14" width="2" indeterminate color="#060d14" />
              <span>Saving…</span>
            </div>
            <div class="ob-save-indicator saved" v-else-if="lastSaved">
              <v-icon size="14" color="#060d14">mdi-check-circle-outline</v-icon>
              <span>Saved</span>
            </div>
          </div>
        </div>

        <!-- Progress -->
        <div class="ob-progress-wrap">
          <div class="ob-progress-track">
            <div class="ob-progress-fill" :style="{ width: progressPercent + '%' }" />
          </div>
          <div class="ob-steps-row">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="ob-step"
              :class="{ active: currentStep === i, done: currentStep > i }"
              @click="tryGoToStep(i)"
            >
              <div class="ob-step-dot">
                <v-icon v-if="currentStep > i" size="13">mdi-check</v-icon>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="ob-step-label">{{ step.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Notice ── -->
      <div class="ob-notice-bar">
        <v-icon size="16" color="#060d14">mdi-shield-check-outline</v-icon>
        <span
          >All information is encrypted and handled in accordance with applicable data protection
          laws.</span
        >
      </div>

      <!-- ── Body ── -->
      <div class="ob-body">
        <!-- STEP 0: Company Details -->
        <v-form ref="step0Form" @submit.prevent v-show="currentStep === 0">
          <div class="ob-section">
            <div class="ob-section-head">
              <span class="ob-step-badge">01</span>
              <div>
                <div class="ob-section-title">Company Details</div>
                <div class="ob-section-sub">Tell us about your organisation</div>
              </div>
            </div>

            <div class="ob-grid-2">
              <v-text-field
                v-model="form.company_name"
                label="Legal Company Name"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.trading_name"
                label="Trading Name (if different)"
                variant="outlined"
                density="comfortable"
                class="ob-field"
              />
            </div>

            <div class="ob-grid-2">
              <v-select
                v-model="form.organisation_type"
                :items="organisationTypes"
                item-title="label"
                item-value="value"
                label="Organisation Type"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.registration_number"
                label="Registration / RC Number"
                variant="outlined"
                density="comfortable"
                class="ob-field"
              />
            </div>

            <div class="ob-grid-3">
              <v-menu v-model="incorporationMenu" :close-on-content-click="false" location="bottom">
                <template #activator="{ props }">
                  <v-text-field
                    v-model="form.date_of_incorporation"
                    label="Date of Incorporation"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    :rules="[dateRule]"
                    class="ob-field"
                  />
                </template>

                <v-date-picker
                  :model-value="form.date_of_incorporation"
                  @update:model-value="
                    (val) => {
                      form.date_of_incorporation = formatDate(val)
                      incorporationMenu = false
                    }
                  "
                />
              </v-menu>
              <v-select
                v-model="form.registration_country"
                :items="countries"
                label="Country of Registration"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.website"
                label="Website"
                variant="outlined"
                density="comfortable"
                placeholder="https://"
                class="ob-field"
              />
            </div>

            <v-textarea
              v-model="form.industry_description"
              label="Brief Description of Business Activities"
              variant="outlined"
              density="comfortable"
              rows="3"
              :rules="[required]"
              class="ob-field"
            />

            <!-- Regulatory status -->
            <div class="ob-info-card text-white mt-2">
              <div class="ob-info-card-title">
                <v-icon size="16" color="#060d14">mdi-bank-outline</v-icon>
                Regulatory Status
              </div>
              <div class="ob-radio-group mt-3">
                <div class="ob-radio-label">
                  Is your organisation regulated? <span class="ob-req">*</span>
                </div>
                <v-radio-group
                  v-model="form.is_regulated"
                  inline
                  :rules="[radioRequired]"
                  hide-details="auto"
                >
                  <v-radio label="Yes, we are regulated" :value="'yes'" />
                  <v-radio label="No, not currently" :value="'no'" />
                  <v-radio label="Not Applicable" :value="'na'" />
                </v-radio-group>
              </div>
              <template v-if="form.is_regulated === 'yes'">
                <div class="ob-grid-3 mt-3">
                  <v-text-field
                    v-model="form.regulator_name"
                    variant="outlined"
                    density="comfortable"
                    :rules="[required]"
                    class="ob-field"
                    placeholder="e.g. CBN, SEC, NAICOM"
                  />
                  <v-text-field
                    v-model="form.regulatory_license_number"
                    placeholder="License Number"
                    variant="outlined"
                    density="comfortable"
                    :rules="[required]"
                    class="ob-field"
                  />
                  <v-menu
                    v-model="licenseExpiryMenu"
                    :close-on-content-click="false"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-model="form.license_expiry_date"
                        placeholder="License Expiry Date"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="props"
                        :rules="[dateRule]"
                        class="ob-field"
                      />
                    </template>

                    <v-date-picker
                      :model-value="form.license_expiry_date"
                      @update:model-value="
                        (val) => {
                          form.license_expiry_date = formatDate(val)
                          licenseExpiryMenu = false
                        }
                      "
                    />
                  </v-menu>
                </div>
              </template>
            </div>
          </div>
        </v-form>

        <!-- STEP 1: Contact & Address -->
        <v-form ref="step1Form" @submit.prevent v-show="currentStep === 1">
          <div class="ob-section">
            <div class="ob-section-head">
              <span class="ob-step-badge">02</span>
              <div>
                <div class="ob-section-title">Primary Contact & Address</div>
                <div class="ob-section-sub">The authorised person completing this application</div>
              </div>
            </div>

            <div class="ob-grid-2">
              <v-text-field
                v-model="form.contact_full_name"
                label="Full Name"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.contact_job_title"
                label="Job Title"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
            <div class="ob-grid-2">
              <v-text-field
                v-model="form.contact_email"
                label="Email Address"
                variant="outlined"
                density="comfortable"
                :rules="[required, emailRule]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.contact_phone"
                label="Phone Number"
                variant="outlined"
                density="comfortable"
                :rules="[required, phoneRule]"
                class="ob-field"
                placeholder="+234..."
              />
            </div>

            <div class="ob-divider my-5" />

            <v-text-field
              v-model="form.registered_address"
              label="Registered Address"
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              class="ob-field"
            />
            <v-text-field
              v-model="form.operating_address"
              label="Operating Address (if different)"
              variant="outlined"
              density="comfortable"
              class="ob-field"
            />
            <div class="ob-grid-2">
              <v-text-field
                v-model="form.city"
                label="City"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-select
                v-model="form.country"
                :items="countries"
                label="Country"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
          </div>
        </v-form>

        <!-- STEP 2: Directors & UBOs -->
        <div v-show="currentStep === 2">
          <div class="ob-section">
            <div class="ob-section-head">
              <span class="ob-step-badge">03</span>
              <div>
                <div class="ob-section-title">Directors & Beneficial Owners</div>
                <div class="ob-section-sub">Add all directors and any UBO with ≥ 10% ownership</div>
              </div>
            </div>

            <div v-if="directors.length === 0" class="ob-empty-state">
              <v-icon size="36" color="#334155">mdi-account-multiple-outline</v-icon>
              <p>No directors added yet.</p>
            </div>

            <div class="director-cards" v-if="directors.length > 0">
              <div
                v-for="(dir, i) in directors"
                :key="i"
                class="director-card"
                :class="{ ubo: dir.is_ubo }"
              >
                <div class="director-card-head">
                  <div class="director-avatar">{{ initials(dir.full_name) }}</div>
                  <div class="director-meta">
                    <div class="director-name">{{ dir.full_name || 'Unnamed Director' }}</div>
                    <div class="director-title">{{ dir.job_title }}</div>
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
                    color="#ef4444"
                    @click="removeDirector(i)"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="#060d14"
                    @click="editDirector(i)"
                  >
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>

            <v-btn class="voima-btn-primary mt-4" @click="openDirectorDialog()" elevation="0">
              <v-icon start>mdi-plus</v-icon>
              Add Director
            </v-btn>
          </div>
        </div>

        <!-- STEP 3: Service & Compliance -->
        <v-form ref="step3Form" @submit.prevent v-show="currentStep === 3">
          <div class="ob-section">
            <div class="ob-section-head">
              <span class="ob-step-badge">04</span>
              <div>
                <div class="ob-section-title">Service Requirements</div>
                <div class="ob-section-sub">Help us understand what you need</div>
              </div>
            </div>

            <div class="ob-grid-2">
              <!-- <v-select
                v-model="form.service_package"
                :items="servicePackages"
                item-title="label"
                item-value="value"
                label="Preferred Service Package"
                variant="outlined"
                density="comfortable"
                class="ob-field"
              /> -->
              <v-select
                v-model="form.estimated_monthly_transactions"
                :items="transactionBands"
                label="Estimated Monthly Transactions"
                variant="outlined"
                density="comfortable"
                class="ob-field"
              />
              <v-select
                :items="employeesCounts"
                label="Number of Employees"
                variant="outlined"
                density="comfortable"
                class="ob-field"
              />
              <v-select
                :items="operationsOptions"
                label="Business operations"
                variant="outlined"
                density="comfortable"
                class="ob-field"
              />
            </div>

            <div class="ob-label mb-2">Areas of Service Required <span class="ob-req">*</span></div>
            <div class="service-chips">
              <div
                v-for="svc in serviceOptions"
                :key="svc.value"
                class="service-chip"
                :class="{ selected: form.service_interest.includes(svc.value) }"
                @click="toggleService(svc.value)"
              >
                <v-icon size="15">{{ svc.icon }}</v-icon>
                {{ svc.label }}
              </div>
            </div>

            <v-textarea
              v-model="form.description_of_needs"
              label="Describe Your Compliance Needs"
              variant="outlined"
              density="comfortable"
              rows="4"
              :rules="[required]"
              class="ob-field mt-4"
              placeholder="Briefly explain your current compliance challenges and what you're hoping Voima can help you with..."
            />

            <div class="ob-divider my-5" />

            <div class="ob-label mb-3">Existing Compliance Programme</div>
            <div class="ob-radio-group">
              <v-radio-group
                v-model="form.has_existing_compliance_program"
                inline
                hide-details="auto"
              >
                <v-radio label="Yes, we have an existing programme" :value="true" color="#060d14" />
                <v-radio label="No, we are starting from scratch" :value="false" color="#060d14" />
              </v-radio-group>
            </div>
            <v-textarea
              v-if="form.has_existing_compliance_program"
              v-model="form.existing_compliance_notes"
              label="Briefly describe your current compliance setup"
              variant="outlined"
              density="comfortable"
              rows="3"
              class="ob-field mt-3"
            />
            <v-textarea
              v-model="form.customer_base_description"
              label="Describe Your Customer / User Base"
              variant="outlined"
              density="comfortable"
              rows="3"
              class="ob-field mt-3"
              placeholder="e.g. retail customers, SMEs, institutional clients, geographic spread…"
            />
          </div>
        </v-form>

        <!-- STEP 4: Documents -->
        <div v-show="currentStep === 4">
          <div class="ob-section">
            <div class="ob-section-head">
              <span class="ob-step-badge">05</span>
              <div>
                <div class="ob-section-title">Supporting Documents</div>
                <div class="ob-section-sub">Upload required corporate and compliance documents</div>
              </div>
            </div>

            <div class="doc-notice">
              <v-icon size="15">mdi-information-outline</v-icon>
              Accepted formats: PDF, JPG, PNG — max 10MB per file. All uploads are encrypted.
            </div>

            <div class="doc-grid">
              <div
                v-for="doc in requiredDocs"
                :key="doc.key"
                class="doc-card"
                :class="{
                  uploaded: uploads[doc.key],
                  error: uploadErrors[doc.key],
                  uploading: uploading[doc.key]
                }"
              >
                <div class="doc-card-left">
                  <div class="doc-icon-wrap">
                    <v-icon size="22" :color="uploads[doc.key] ? '#060d14' : '#64748b'">{{
                      doc.icon
                    }}</v-icon>
                  </div>
                  <div class="doc-info">
                    <div class="doc-name">
                      {{ doc.label }}
                      <span class="ob-req" v-if="doc.required">*</span>
                    </div>
                    <div class="doc-hint">{{ doc.hint }}</div>
                    <div class="doc-uploaded-name" v-if="uploads[doc.key]">
                      <v-icon size="12" color="#060d14">mdi-check-circle</v-icon>
                      {{ uploads[doc.key].name }}
                    </div>
                    <div class="doc-error" v-if="uploadErrors[doc.key]">
                      {{ uploadErrors[doc.key] }}
                    </div>
                  </div>
                </div>
                <div class="doc-card-right">
                  <v-btn
                    size="small"
                    variant="tonal"
                    :color="uploads[doc.key] ? '#060d14' : '#334155'"
                    :loading="uploading[doc.key]"
                    @click="triggerFile(doc.key)"
                    elevation="0"
                    class="doc-upload-btn"
                  >
                    {{ uploads[doc.key] ? 'Replace' : 'Upload' }}
                  </v-btn>
                  <input
                    :ref="(el) => (fileInputs[doc.key] = el)"
                    type="file"
                    accept="image/*,.pdf"
                    style="display: none"
                    @change="handleFile($event, doc.key, doc.docType)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 5: Review & Submit -->
        <div v-show="currentStep === 5">
          <div class="ob-section">
            <div class="ob-section-head">
              <span class="ob-step-badge">06</span>
              <div>
                <div class="ob-section-title">Review & Submit</div>
                <div class="ob-section-sub">Confirm all details before submitting</div>
              </div>
            </div>

            <div class="review-grid">
              <!-- Company -->
              <div class="review-card" @click="goToStep(0)">
                <div class="review-card-head">
                  <v-icon size="15">mdi-office-building-outline</v-icon>
                  Company
                  <v-icon size="14" class="review-edit-icon">mdi-pencil-outline</v-icon>
                </div>
                <div class="review-row">
                  <span>Legal Name</span><span>{{ form.company_name }}</span>
                </div>
                <div class="review-row" v-if="form.trading_name">
                  <span>Trading As</span><span>{{ form.trading_name }}</span>
                </div>
                <div class="review-row">
                  <span>Type</span><span>{{ form.organisation_type }}</span>
                </div>
                <div class="review-row" v-if="form.registration_number">
                  <span>RC Number</span><span>{{ form.registration_number }}</span>
                </div>
                <div class="review-row">
                  <span>Regulated</span>
                  <span :class="form.is_regulated ? 'review-yes' : 'review-no'">
                    {{ form.is_regulated ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>

              <!-- Contact -->
              <div class="review-card" @click="goToStep(1)">
                <div class="review-card-head">
                  <v-icon size="15">mdi-account-outline</v-icon>
                  Contact
                  <v-icon size="14" class="review-edit-icon">mdi-pencil-outline</v-icon>
                </div>
                <div class="review-row">
                  <span>Name</span><span>{{ form.contact_full_name }}</span>
                </div>
                <div class="review-row">
                  <span>Title</span><span>{{ form.contact_job_title }}</span>
                </div>
                <div class="review-row">
                  <span>Email</span><span>{{ form.contact_email }}</span>
                </div>
                <div class="review-row">
                  <span>Phone</span><span>{{ form.contact_phone }}</span>
                </div>
                <div class="review-row">
                  <span>City</span><span>{{ form.city }}</span>
                </div>
              </div>

              <!-- Directors -->
              <div class="review-card" @click="goToStep(2)">
                <div class="review-card-head">
                  <v-icon size="15">mdi-account-multiple-outline</v-icon>
                  Directors
                  <v-icon size="14" class="review-edit-icon">mdi-pencil-outline</v-icon>
                </div>
                <div class="review-row" v-if="directors.length === 0">
                  <span class="review-missing">No directors added</span>
                </div>
                <div class="review-row" v-for="(d, i) in directors" :key="i">
                  <span>{{ d.full_name }}</span>
                  <span>{{ d.job_title }}</span>
                </div>
              </div>

              <!-- Service -->
              <div class="review-card" @click="goToStep(3)">
                <div class="review-card-head">
                  <v-icon size="15">mdi-shield-check-outline</v-icon>
                  Service
                  <v-icon size="14" class="review-edit-icon">mdi-pencil-outline</v-icon>
                </div>
                <div class="review-row" v-if="form.service_package">
                  <span>Package</span><span>{{ form.service_package }}</span>
                </div>
                <div class="review-row">
                  <span>Areas</span>
                  <span>{{ form.service_interest.length }} selected</span>
                </div>
              </div>

              <!-- Documents -->
              <div class="review-card full-width" @click="goToStep(4)">
                <div class="review-card-head">
                  <v-icon size="15">mdi-file-multiple-outline</v-icon>
                  Documents
                  <v-icon size="14" class="review-edit-icon">mdi-pencil-outline</v-icon>
                </div>
                <div class="review-docs-grid">
                  <div
                    v-for="doc in requiredDocs"
                    :key="doc.key"
                    class="review-doc-row"
                    :class="{ ok: uploads[doc.key], missing: !uploads[doc.key] && doc.required }"
                  >
                    <v-icon size="14">{{
                      uploads[doc.key] ? 'mdi-check-circle' : 'mdi-circle-outline'
                    }}</v-icon>
                    {{ doc.label }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Declaration -->
            <div class="declaration-box text-white mt-6">
              <v-checkbox v-model="form.declaration" color="white" hide-details>
                <template #label>
                  <span class="declaration-text">
                    I am authorised to submit this application on behalf of
                    <strong>{{ form.company_name || 'my organisation' }}</strong
                    >, and confirm that all information provided is accurate and complete.
                  </span>
                </template>
              </v-checkbox>
            </div>
          </div>
        </div>
      </div>
      <!-- /ob-body -->

      <!-- ── Footer nav ── -->
      <div class="ob-footer">
        <v-btn
          class="voima-btn-ghost"
          :disabled="currentStep === 0"
          @click="prevStep"
          elevation="0"
        >
          <v-icon start size="18">mdi-arrow-left</v-icon>
          Back
        </v-btn>

        <div class="ob-footer-info">
          <div class="ob-footer-step">Step {{ currentStep + 1 }} of {{ steps.length }}</div>
          <div class="ob-footer-name" v-if="form.company_name">{{ form.company_name }}</div>
        </div>

        <v-btn
          v-if="currentStep < steps.length - 1"
          class="voima-btn-primary"
          :loading="saving"
          @click="nextStep"
          elevation="0"
        >
          Continue
          <v-icon end size="18">mdi-arrow-right</v-icon>
        </v-btn>

        <v-btn
          v-else
          class="voima-btn-success"
          :loading="submitting"
          :disabled="!form.declaration || !allRequiredDocsUploaded"
          @click="submitApplication"
          elevation="0"
        >
          <v-icon start size="18">mdi-send-check</v-icon>
          Submit Application
        </v-btn>
      </div>

      <!-- ── Director Dialog ── -->
      <v-dialog v-model="directorDialog" max-width="580">
        <v-card class="director-dialog-card">
          <div class="director-dialog-head">
            <span>{{ editingDirectorIndex !== null ? 'Edit' : 'Add' }} Director / UBO</span>
            <v-btn icon size="small" variant="text" @click="directorDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-form ref="directorForm" @submit.prevent>
            <div class="director-dialog-body">
              <div class="ob-grid-2">
                <v-text-field
                  v-model="directorDraft.full_name"
                  label="Full Name"
                  variant="outlined"
                  density="comfortable"
                  :rules="[required]"
                  class="ob-field"
                />
                <v-text-field
                  v-model="directorDraft.job_title"
                  label="Job Title"
                  variant="outlined"
                  density="comfortable"
                  :rules="[required]"
                  class="ob-field"
                />
              </div>
              <div class="ob-grid-2">
                <v-text-field
                  v-model="directorDraft.nationality"
                  label="Nationality"
                  variant="outlined"
                  density="comfortable"
                  class="ob-field"
                />
                <v-text-field
                  v-model="directorDraft.date_of_birth"
                  label="Date of Birth"
                  variant="outlined"
                  density="comfortable"
                  placeholder="YYYY-MM-DD"
                  class="ob-field"
                />
              </div>
              <div class="ob-grid-2">
                <v-select
                  v-model="directorDraft.id_type"
                  :items="['International Passport', 'National ID', `Driver's Licence`]"
                  label="ID Type"
                  variant="outlined"
                  density="comfortable"
                  class="ob-field"
                />
                <v-text-field
                  v-model="directorDraft.id_number"
                  label="ID Number"
                  variant="outlined"
                  density="comfortable"
                  class="ob-field"
                />
              </div>
              <v-text-field
                v-model="directorDraft.email"
                label="Email"
                variant="outlined"
                density="comfortable"
                :rules="[emailRule]"
                class="ob-field"
              />

              <!-- <div class="ob-info-card mt-2">
                <v-checkbox
                  v-model="directorDraft.is_ubo"
                  label="This person is a Ultimate Beneficial Owner (UBO)"
                  hide-details
                  color="white"
                  base-color="white"
                />
                <v-text-field
                  v-if="directorDraft.is_ubo"
                  v-model.number="directorDraft.ownership_percent"
                  placeholder="Ownership Percentage (%)"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  :rules="[required]"
                  class="ob-field mt-3"
                  style="max-width: 200px"
                />
              </div> -->
            </div>
          </v-form>
          <div class="director-dialog-footer">
            <v-btn class="voima-btn-ghost" @click="directorDialog = false" elevation="0"
              >Cancel</v-btn
            >
            <v-btn class="voima-btn-primary" @click="saveDirector" elevation="0">
              {{ editingDirectorIndex !== null ? 'Save Changes' : 'Add Director' }}
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- ── Snackbar ── -->
      <v-snackbar v-model="snack.show" :color="snack.color" :timeout="5000" location="bottom right">
        {{ snack.message }}
        <template #actions>
          <v-btn variant="text" @click="snack.show = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
const incorporationMenu = ref(false)
const licenseExpiryMenu = ref(false)
const formatDate = (date) => {
  if (!date) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
// ── Disclaimer ─────────────────────────────────────────────────────────────
const showDisclaimer = ref(true)
const disclaimerScrolled = ref(false)
const disclaimerBody = ref(null)
const disclaimerAccepted = ref(false)

const handleDisclaimerScroll = (e) => {
  const el = e.target
  disclaimerScrolled.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 20
}
const acceptDisclaimer = () => {
  disclaimerAccepted.value = true
  showDisclaimer.value = false
}

// ── Steps ──────────────────────────────────────────────────────────────────
const steps = [
  { label: 'Company' },
  { label: 'Contact' },
  { label: 'Directors' },
  { label: 'Services' },
  { label: 'Documents' },
  { label: 'Review' }
]
const currentStep = ref(0)
const progressPercent = computed(() => Math.round((currentStep.value / (steps.length - 1)) * 100))

// ── Form refs ──────────────────────────────────────────────────────────────
const step0Form = ref(null)
const step1Form = ref(null)
const step3Form = ref(null)
const directorForm = ref(null)

const stepFormMap = { 0: step0Form, 1: step1Form, 3: step3Form }

// ── Application state ──────────────────────────────────────────────────────
const applicationId = ref(null)
const saving = ref(false)
const lastSaved = ref(false)
const submitting = ref(false)
const showSuccess = ref(false)
const submittedRef = ref('')

// ── Form data ──────────────────────────────────────────────────────────────
const form = reactive({
  company_name: '',
  trading_name: '',
  organisation_type: null,
  registration_number: '',
  registration_country: 'United Kingdom',
  date_of_incorporation: '',
  website: '',
  industry_description: '',
  is_regulated: null,
  regulator_name: '',
  regulatory_license_number: '',
  license_expiry_date: '',
  contact_full_name: '',
  contact_job_title: '',
  contact_email: '',
  contact_phone: '',
  registered_address: '',
  operating_address: '',
  city: '',
  country: 'United Kingdom',
  service_package: null,
  service_interest: [],
  description_of_needs: '',
  has_existing_compliance_program: false,
  existing_compliance_notes: '',
  estimated_monthly_transactions: '',
  customer_base_description: '',
  declaration: false
})

// ── Directors ──────────────────────────────────────────────────────────────
const directors = ref([])
const directorDialog = ref(false)
const editingDirectorIndex = ref(null)
const directorDraft = reactive({
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

const openDirectorDialog = (index = null) => {
  editingDirectorIndex.value = index
  if (index !== null) {
    Object.assign(directorDraft, directors.value[index])
  } else {
    Object.assign(directorDraft, {
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
const editDirector = (i) => openDirectorDialog(i)
const removeDirector = (i) => directors.value.splice(i, 1)
const saveDirector = async () => {
  const { valid } = await directorForm.value.validate()
  if (!valid) return

  const payload = { ...directorDraft }
  if (editingDirectorIndex.value !== null) {
    directors.value[editingDirectorIndex.value] = payload
  } else {
    directors.value.push(payload)
  }
  directorDialog.value = false
}
const initials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

// ── File uploads ───────────────────────────────────────────────────────────
const uploads = reactive({})
const uploadErrors = reactive({})
const uploading = reactive({})
const fileInputs = reactive({})

const requiredDocs = [
  {
    key: 'certificate_of_incorporation',
    docType: 'certificate_of_incorporation',
    label: 'Certificate of Incorporation',
    hint: 'Issued by CAC or equivalent',
    icon: 'mdi-certificate-outline',
    required: true
  },
  {
    key: 'memorandum_articles',
    docType: 'memorandum_articles',
    label: 'Memorandum & Articles of Association',
    hint: 'Full document',
    icon: 'mdi-file-document-outline',
    required: true
  },
  {
    key: 'aml_cft_policy',
    docType: 'aml_cft_policy',
    label: 'AML/CFT Policy',
    hint: 'Current version',
    icon: 'mdi-shield-lock-outline',
    required: true
  },
  {
    key: 'kyc_policy',
    docType: 'kyc_policy',
    label: 'KYC Policy',
    hint: 'Current version',
    icon: 'mdi-account-check-outline',
    required: true
  },
  {
    key: 'regulatory_license',
    docType: 'regulatory_license',
    label: 'Regulatory License',
    hint: 'If regulated',
    icon: 'mdi-bank-outline',
    required: false
  },
  {
    key: 'board_resolution',
    docType: 'board_resolution',
    label: 'Board Resolution',
    hint: 'Authorising this application',
    icon: 'mdi-gavel',
    required: false
  },
  {
    key: 'latest_audited_accounts',
    docType: 'latest_audited_accounts',
    label: 'Latest Audited Accounts',
    hint: 'Most recent financial year',
    icon: 'mdi-chart-bar',
    required: false
  },
  {
    key: 'organizational_chart',
    docType: 'organizational_chart',
    label: 'Organisational Chart',
    hint: 'PDF or image',
    icon: 'mdi-sitemap-outline',
    required: false
  }
]

const allRequiredDocsUploaded = computed(() =>
  requiredDocs.filter((d) => d.required).every((d) => uploads[d.key])
)

const triggerFile = (key) => fileInputs[key]?.click()

const handleFile = async (event, key, docType) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    uploadErrors[key] = 'File too large. Max 10MB.'
    return
  }
  delete uploadErrors[key]
  uploading[key] = true

  try {
    if (!applicationId.value) await saveDraft()

    const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')

    const { data: rpcData, error: rpcError } = await supabase.rpc('upload_onboarding_document', {
      p_application_id: applicationId.value,
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

    uploads[key] = file
    showSnack('Document uploaded successfully', 'success')
  } catch (err) {
    uploadErrors[key] = 'Upload failed: ' + err.message
    showSnack('Upload failed: ' + err.message)
  } finally {
    uploading[key] = false
    event.target.value = ''
  }
}

// ── Save draft ──────────────────────────────────────────────────────────────
const saveDraft = async () => {
  saving.value = true
  lastSaved.value = false
  try {
    const payload = {
      p_id: applicationId.value,
      p_company_name: form.company_name || null,
      p_trading_name: form.trading_name || null,
      p_organisation_type: form.organisation_type || null,
      p_registration_number: form.registration_number || null,
      p_registration_country: form.registration_country,
      p_date_of_incorporation: form.date_of_incorporation || null,
      p_website: form.website || null,
      p_industry_description: form.industry_description || null,
      p_is_regulated: form.is_regulated ?? false,
      p_regulator_name: form.regulator_name || null,
      p_regulatory_license_number: form.regulatory_license_number || null,
      p_license_expiry_date: form.license_expiry_date || null,
      p_contact_full_name: form.contact_full_name || null,
      p_contact_job_title: form.contact_job_title || null,
      p_contact_email: form.contact_email || null,
      p_contact_phone: form.contact_phone || null,
      p_registered_address: form.registered_address || null,
      p_operating_address: form.operating_address || null,
      p_city: form.city || null,
      p_country: form.country,
      p_service_package: form.service_package || null,
      p_service_interest: form.service_interest.length ? form.service_interest : null,
      p_description_of_needs: form.description_of_needs || null,
      p_has_existing_compliance_program: form.has_existing_compliance_program,
      p_existing_compliance_notes: form.existing_compliance_notes || null,
      p_estimated_monthly_transactions: form.estimated_monthly_transactions || null,
      p_customer_base_description: form.customer_base_description || null
    }
    console.log('save draft payload:', payload)
    const { data, error } = await supabase.rpc('upsert_onboarding_application', payload)
    console.log('save draft response:', data)
    if (error) throw error
    applicationId.value = data
    lastSaved.value = true
  } catch (err) {
    console.log('save draft error:', err)
    showSnack('Failed to save: ' + err.message)
    throw err
  } finally {
    saving.value = false
  }
}

// ── Directors save ─────────────────────────────────────────────────────────
const saveDirectorsToDb = async () => {
  for (const dir of directors.value) {
    if (!dir._saved) {
      const payload = {
        p_id: dir.id || null,
        p_application_id: applicationId.value,
        p_full_name: dir.full_name,
        p_job_title: dir.job_title || null,
        p_nationality: dir.nationality || null,
        p_date_of_birth: dir.date_of_birth || null,
        p_id_type: dir.id_type || null,
        p_id_number: dir.id_number || null,
        p_email: dir.email || null,
        p_is_ubo: dir.is_ubo,
        p_ownership_percent: dir.ownership_percent || null
      }
      console.log('save directors payload', payload)
      const { data } = await supabase.rpc('upsert_onboarding_director', payload)
      console.log('save directors response', data)
      dir.id = data
      dir._saved = true
    }
  }
}

// ── Validate & navigate ────────────────────────────────────────────────────
const validateCurrentStep = async () => {
  if (currentStep.value === 2) {
    return true
  }
  if (currentStep.value === 4) {
    if (!allRequiredDocsUploaded.value) {
      showSnack('Please upload all required documents (marked *) before continuing.')
      return false
    }
    return true
  }
  if (currentStep.value === 5) return true

  const formRef = stepFormMap[currentStep.value]?.value
  if (!formRef) return true

  const { valid } = await formRef.validate()
  if (!valid) showSnack('Please fill all required fields before continuing.')
  return valid
}

const nextStep = async () => {
  const valid = await validateCurrentStep()
  if (!valid) return

  try {
    await saveDraft()
    if (currentStep.value === 2 && applicationId.value) {
      await saveDirectorsToDb()
    }
  } catch {
    return
  }

  currentStep.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const tryGoToStep = (i) => {
  if (i < currentStep.value) currentStep.value = i
}

const goToStep = (i) => {
  currentStep.value = i
}

// ── Submit ─────────────────────────────────────────────────────────────────
const submitApplication = async () => {
  if (!form.declaration) {
    showSnack('Please accept the declaration.')
    return
  }
  if (!allRequiredDocsUploaded.value) {
    showSnack('Please upload all required documents.')
    return
  }

  submitting.value = true
  try {
    const { data, error } = await supabase.rpc('submit_onboarding_application', {
      p_application_id: applicationId.value
    })
    if (error) throw error

    submittedRef.value = data.reference_number
    showSuccess.value = true
  } catch (err) {
    showSnack('Submission failed: ' + err.message)
  } finally {
    submitting.value = false
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────
const resetForm = () => {
  showSuccess.value = false
  applicationId.value = null
  lastSaved.value = false
  currentStep.value = 0
  directors.value = []
  Object.assign(form, {
    company_name: '',
    trading_name: '',
    organisation_type: null,
    registration_number: '',
    registration_country: 'United Kingdom',
    date_of_incorporation: '',
    website: '',
    industry_description: '',
    is_regulated: null,
    regulator_name: '',
    regulatory_license_number: '',
    license_expiry_date: '',
    contact_full_name: '',
    contact_job_title: '',
    contact_email: '',
    contact_phone: '',
    registered_address: '',
    operating_address: '',
    city: '',
    country: 'United Kingdom',
    service_package: null,
    service_interest: [],
    description_of_needs: '',
    has_existing_compliance_program: false,
    existing_compliance_notes: '',
    estimated_monthly_transactions: '',
    customer_base_description: '',
    declaration: false
  })
  Object.keys(uploads).forEach((k) => delete uploads[k])
  Object.keys(uploadErrors).forEach((k) => delete uploadErrors[k])
  showDisclaimer.value = true
  disclaimerScrolled.value = false
  disclaimerAccepted.value = false
}

// ── Service interest toggles ───────────────────────────────────────────────
const toggleService = (val) => {
  const i = form.service_interest.indexOf(val)
  if (i === -1) form.service_interest.push(val)
  else form.service_interest.splice(i, 1)
}

// ── Snackbar ──────────────────────────────────────────────────────────────
const snack = reactive({ show: false, message: '', color: 'error' })
const showSnack = (message, color = 'error') => {
  snack.message = message
  snack.color = color
  snack.show = true
}

// ── Validation rules ──────────────────────────────────────────────────────
const required = (v) => (v !== null && v !== undefined && String(v).trim() !== '') || 'Required'
const radioRequired = (v) => v !== null || 'Required'
const emailRule = (v) => !v || /.+@.+\..+/.test(v) || 'Invalid email'
const phoneRule = (v) => !v || /^\+?[\d\s\-]{7,}$/.test(v) || 'Invalid phone number'
const dateRule = (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Use YYYY-MM-DD format'

// ── Static data ───────────────────────────────────────────────────────────
const organisationTypes = [
  { label: 'Fintech', value: 'fintech' },
  { label: 'Bank', value: 'bank' },
  { label: 'Microfinance Institution', value: 'microfinance' },
  { label: 'Insurance Company', value: 'insurance' },
  { label: 'Payment Service Provider', value: 'payment_service_provider' },
  { label: 'Crypto / Digital Asset Exchange', value: 'crypto_exchange' },
  { label: 'Asset Management', value: 'asset_management' },
  { label: 'NGO / Non-Profit', value: 'ngo' },
  { label: 'Other', value: 'other' }
]

const servicePackages = [
  { label: 'Starter', value: 'starter' },
  { label: 'Growth', value: 'growth' },
  { label: 'Regulated', value: 'regulated' },
  { label: 'Enterprise', value: 'enterprise' }
]

const serviceOptions = [
  { label: 'AML/CFT Advisory', value: 'aml_advisory', icon: 'mdi-shield-alert-outline' },
  { label: 'KYC Review', value: 'kyc_review', icon: 'mdi-account-check-outline' },
  {
    label: 'Policy Development',
    value: 'policy_development',
    icon: 'mdi-file-document-edit-outline'
  },
  { label: 'Regulatory Guidance', value: 'regulatory_guidance', icon: 'mdi-bank-outline' },
  { label: 'Vendor Assessment', value: 'vendor_assessment', icon: 'mdi-storefront-outline' },
  { label: 'Governance Review', value: 'governance_review', icon: 'mdi-scale-balance' },
  { label: 'Audit Preparation', value: 'audit_preparation', icon: 'mdi-clipboard-check-outline' },
  { label: 'Training & Awareness', value: 'training', icon: 'mdi-school-outline' }
]

const transactionBands = [
  'Under 500',
  '500 – 1,000',
  '1,000 – 5,000',
  '5,000 – 20,000',
  '20,000 – 50,000',
  'Over 50,000'
]
const employeesCounts = ['1 – 50', '50 – 100', '100 – 200', '200 – 500', '500 – 1000', 'Over 1,000']

const operationsOptions = [
  'Cash-based activities',
  'Crypto and digital assets',
  'Health and safety compliance',
  'Cross-border cash movements'
]

const countries = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United Kingdom',
  'United States',
  'Canada',
  'UAE',
  'Rwanda',
  'Senegal',
  'Other'
]
</script>

<style>
/* ── Palette ────────────────────────────────────────────────────────────── */
:root {
  --v-bg: #f5f7fa;
  --v-surface: #ffffff;
  --v-header: #ffffff;
  --v-field: #f8fafc;
  --v-teal: #060d14;
  --v-teal-d: #00a892;
  --v-teal-lt: #060d14;
  --v-ink: #0f172a;
  --v-muted: #64748b;
  --v-subtle: #94a3b8;
  --v-border: #e2e8f0;
  --v-border-d: #cbd5e1;
  --v-success: #22c55e;
  --v-danger: #ef4444;
  --v-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.06);
  --v-shadow-d: 0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* ── Global Vuetify light overrides ─────────────────────────────────────── */
.voima-app,
.voima-app .v-application__wrap {
  background: var(--v-bg) !important;
}

/* Dialogs */
.voima-app .v-overlay__content > .v-card {
  background: #ffffff !important;
  color: var(--v-ink) !important;
}

/* Dropdown menus */
.voima-app .v-list {
  background: #ffffff !important;
  color: var(--v-ink) !important;
  border: 1px solid var(--v-border) !important;
  box-shadow: var(--v-shadow-d) !important;
}
.voima-app .v-list-item:hover {
  background: var(--v-teal-lt) !important;
}
.voima-app .v-list-item--active {
  background: var(--v-teal-lt) !important;
  color: var(--v-teal) !important;
}

/* Snackbar */
.voima-app .v-snackbar__content {
}
</style>

<style scoped>
/* ── App shell ──────────────────────────────────────────────────────────── */
.voima-app {
  background: var(--v-bg) !important;
  min-height: 100vh;
}

.onboarding-root {
  background: var(--v-bg);
  min-height: 100vh;
  padding-bottom: 120px;
  color: var(--v-ink);
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.ob-header {
  background: var(--v-header);
  border-bottom: 1px solid var(--v-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow:
    0 1px 0 var(--v-border),
    0 2px 8px rgba(0, 0, 0, 0.04);
}
.ob-header-inner {
  max-width: 920px;
  margin: 0 auto;
  padding: 14px 24px 10px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.ob-logo-img {
  height: 32px;
  width: auto;
  object-fit: contain;
}
.ob-header-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--v-muted);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.ob-header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.ob-save-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--v-muted);
}
.ob-save-indicator.saved {
  color: var(--v-teal);
}

/* Progress */
.ob-progress-wrap {
  max-width: 920px;
  margin: 0 auto;
  padding: 10px 24px 14px;
}
.ob-progress-track {
  height: 2px;
  background: var(--v-border);
  border-radius: 99px;
  margin-bottom: 16px;
  overflow: hidden;
}
.ob-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--v-teal), #0ea5e9);
  border-radius: 99px;
  transition: width 0.4s ease;
}
.ob-steps-row {
  display: flex;
  justify-content: space-between;
}
.ob-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
.ob-step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--v-bg);
  color: var(--v-subtle);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}
.ob-step.active .ob-step-dot {
  background: var(--v-teal);
  border-color: var(--v-teal);
  color: #fff;
}
.ob-step.done .ob-step-dot {
  background: var(--v-teal-lt);
  border-color: var(--v-teal);
  color: white;
}
.ob-step-label {
  font-size: 10px;
  color: var(--v-subtle);
  font-weight: 500;
  letter-spacing: 0.03em;
}
.ob-step.active .ob-step-label {
  color: var(--v-teal);
  font-weight: 700;
}
.ob-step.done .ob-step-label {
  color: var(--v-teal);
}

/* ── Notice bar ─────────────────────────────────────────────────────────── */
.ob-notice-bar {
  max-width: 920px;
  margin: 20px auto 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

/* ── Body ───────────────────────────────────────────────────────────────── */
.ob-body {
  max-width: 920px;
  margin: 20px auto;
  padding: 0 24px;
}

/* ── Section card ───────────────────────────────────────────────────────── */
.ob-section {
  background: var(--v-surface);
  border: 1px solid var(--v-border);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--v-shadow);
}
.ob-section-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}
.ob-step-badge {
  background: linear-gradient(135deg, var(--v-teal), #0ea5e9);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: 1px;
  flex-shrink: 0;
  margin-top: 2px;
}
.ob-section-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}
.ob-section-sub {
  font-size: 13px;
  margin-top: 2px;
}

/* ── Grids ──────────────────────────────────────────────────────────────── */
.ob-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 4px;
}
.ob-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  margin-bottom: 4px;
}
@media (max-width: 680px) {
  .ob-grid-2,
  .ob-grid-3 {
    grid-template-columns: 1fr;
  }
}
.ob-field {
  margin-bottom: 6px;
}

/* Vuetify field light overrides */
.ob-section :deep(.v-field) {
  background: var(--v-field) !important;
  color: var(--v-ink) !important;
}
.ob-section :deep(.v-field__outline) {
  --v-field-border-color: var(--v-border-d) !important;
}
.ob-section :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: var(--v-teal) !important;
}
.ob-section :deep(.v-label) {
}
.ob-section :deep(.v-field__input) {
}
.ob-section :deep(.v-select__selection) {
}
.ob-section :deep(.v-field__prepend-inner),
.ob-section :deep(.v-field__append-inner) {
  color: var(--v-subtle) !important;
}
.ob-section :deep(.v-messages__message) {
  color: var(--v-danger) !important;
}
.ob-section :deep(.v-radio .v-label) {
  font-size: 13px !important;
}
.ob-section :deep(.v-checkbox .v-label) {
  font-size: 13px !important;
}

/* ── Info card ──────────────────────────────────────────────────────────── */
.ob-info-card :deep(.v-checkbox .v-label) {
  color: #ffffff !important;
}

.ob-info-card :deep(.v-selection-control__input) {
  color: white !important;
}

/* unchecked box border */
.ob-info-card :deep(.v-selection-control__wrapper) {
  color: white !important;
}
.ob-info-card {
  background: var(--v-teal-lt);
  border-radius: 12px;
  padding: 18px 20px;
}
.ob-info-card-title {
  font-size: 13px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ob-radio-group {
  margin-bottom: 0;
}
.ob-radio-label {
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}
.ob-req {
  color: var(--v-danger);
}
.ob-label {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

/* ── Divider ────────────────────────────────────────────────────────────── */
.ob-divider {
  height: 1px;
  background: var(--v-border);
}
.my-5 {
  margin-top: 20px;
  margin-bottom: 20px;
}
.mt-2 {
  margin-top: 8px;
}
.mt-3 {
  margin-top: 12px;
}
.mt-4 {
  margin-top: 16px;
}
.mt-6 {
  margin-top: 24px;
}
.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}

/* ── Service chips ──────────────────────────────────────────────────────── */
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
  border: 1.5px solid var(--v-border-d);
  color: var(--v-muted);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--v-bg);
  user-select: none;
}
.service-chip:hover {
  border-color: var(--v-teal);
  color: var(--v-teal);
  background: var(--v-teal-lt);
}
.service-chip.selected {
  border-color: var(--v-teal);
  background: var(--v-teal-lt);
  color: var(--v-teal-d);
}

/* ── Directors ──────────────────────────────────────────────────────────── */
.ob-empty-state {
  text-align: center;
  padding: 32px;
  color: var(--v-subtle);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.director-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.director-card {
  background: var(--v-bg);
  border: 1px solid var(--v-border);
  border-radius: 12px;
  padding: 14px 16px;
  transition: border-color 0.2s;
}
.director-card.ubo {
  border-color: rgba(0, 201, 177, 0.4);
  background: var(--v-teal-lt);
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
  background: linear-gradient(135deg, var(--v-teal), #0ea5e9);
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
  color: var(--v-ink);
}
.director-title {
  font-size: 12px;
  color: var(--v-muted);
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
  background: var(--v-border);
  color: var(--v-muted);
  border: 1px solid var(--v-border-d);
}
.dir-badge.ubo-badge {
  background: rgba(0, 201, 177, 0.15);
  color: var(--v-teal-d);
  border-color: rgba(0, 201, 177, 0.35);
}

/* ── Documents ──────────────────────────────────────────────────────────── */
.doc-notice {
  background: rgb(238, 150, 150);
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 12px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
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
  background: var(--v-field);
  border: 1.5px solid var(--v-border);
  border-radius: 12px;
  transition: border-color 0.2s;
}
.doc-card.uploaded {
  border-color: rgba(0, 201, 177, 0.4);
  background: var(--v-teal-lt);
}
.doc-card.error {
  border-color: rgba(239, 68, 68, 0.4);
  background: #fff5f5;
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
  background: var(--v-border);
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
  color: var(--v-ink);
}
.doc-hint {
  font-size: 11px;
  color: var(--v-muted);
  margin-top: 2px;
}
.doc-uploaded-name {
  font-size: 11px;
  color: var(--v-teal-d);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.doc-error {
  font-size: 11px;
  color: var(--v-danger);
  margin-top: 4px;
}
.doc-card-right {
  flex-shrink: 0;
}
.doc-upload-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 12px !important;
}

/* ── Review ─────────────────────────────────────────────────────────────── */
.review-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 680px) {
  .review-grid {
    grid-template-columns: 1fr;
  }
}
.review-card {
  background: var(--v-field);
  border: 1px solid var(--v-border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.review-card:hover {
  border-color: var(--v-teal);
  box-shadow: 0 0 0 3px rgba(0, 201, 177, 0.08);
}
.review-card.full-width {
  grid-column: 1 / -1;
}
.review-card-head {
  font-size: 11px;
  font-weight: 700;
  color: var(--v-teal-d);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.review-edit-icon {
  margin-left: auto;
  color: var(--v-subtle);
}
.review-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid var(--v-border);
  font-size: 12px;
}
.review-row span:first-child {
  color: var(--v-muted);
  flex-shrink: 0;
}
.review-row span:last-child {
  color: var(--v-ink);
  font-weight: 500;
  text-align: right;
  word-break: break-word;
}
.review-yes {
  color: var(--v-teal-d) !important;
}
.review-no {
  color: var(--v-muted) !important;
}
.review-missing {
  color: var(--v-subtle);
  font-style: italic;
  font-size: 12px;
}
.review-docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 6px;
}
.review-doc-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--v-muted);
}
.review-doc-row.ok {
  color: var(--v-teal-d);
}
.review-doc-row.missing {
  color: var(--v-danger);
}

/* ── Declaration ────────────────────────────────────────────────────────── */
.declaration-box :deep(.v-selection-control__label) {
  color: white !important;
  opacity: 1 !important;
}
.declaration-box {
  background: var(--v-teal-lt);
  border: 1px solid rgba(0, 201, 177, 0.25);
  border-radius: 12px;
  padding: 16px 20px;
}
.declaration-text {
  font-size: 13px;
  color: white;
  line-height: 1.6;
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
.ob-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--v-surface);
  border-top: 1px solid var(--v-border);
  padding: 14px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 100;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
}
.ob-footer-info {
  flex: 1;
  text-align: center;
}
.ob-footer-step {
  font-size: 12px;
  color: var(--v-muted);
  font-weight: 500;
}
.ob-footer-name {
  font-size: 13px;
  color: var(--v-ink);
  font-weight: 600;
  margin-top: 2px;
}

/* ── Buttons ────────────────────────────────────────────────────────────── */
.voima-btn-primary {
  background: var(--v-teal) !important;
  color: #fff !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 10px !important;
  padding: 0 22px !important;
  height: 42px !important;
  font-size: 13px !important;
  letter-spacing: 0 !important;
}
.voima-btn-primary:hover {
}

.voima-btn-success {
  background: var(--v-success) !important;
  color: #fff !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 10px !important;
  padding: 0 22px !important;
  height: 42px !important;
  font-size: 13px !important;
  letter-spacing: 0 !important;
}

.voima-btn-ghost {
  background: transparent !important;
  color: var(--v-muted) !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: 10px !important;
  height: 42px !important;
  font-size: 13px !important;
  letter-spacing: 0 !important;
}
.voima-btn-ghost:hover {
  color: var(--v-ink) !important;
  background: var(--v-bg) !important;
}

.voima-btn-outline {
  background: transparent !important;
  color: var(--v-teal-d) !important;
  border: var(--v-teal-lt);
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: 10px !important;
  height: 40px !important;
  font-size: 13px !important;
  letter-spacing: 0 !important;
}
.voima-btn-outline:hover {
  background: var(--v-teal-lt) !important;
  border-color: var(--v-teal) !important;
}

/* ── Disclaimer dialog ──────────────────────────────────────────────────── */
.disclaimer-card {
  background: #ffffff !important;
  border: 1px solid var(--v-border) !important;
  border-radius: 16px !important;
  overflow: hidden;
  color: var(--v-ink) !important;
  box-shadow: var(--v-shadow-d) !important;
}
.disclaimer-header {
  background: var(--v-bg);
  border-bottom: 1px solid var(--v-border);
  padding: 20px 28px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.disclaimer-logo {
  height: 28px;
  object-fit: contain;
}
.disclaimer-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  background: var(--v-teal-lt);
  color: white;
  letter-spacing: 0.06em;
}
.disclaimer-body {
  padding: 24px 28px;
  max-height: 320px;
  overflow-y: auto;
}
.disclaimer-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--v-ink);
  margin-bottom: 12px;
}
.disclaimer-text {
  font-size: 13px;
  color: var(--v-muted);
  line-height: 1.7;
}
.disclaimer-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.disclaimer-list li {
  font-size: 13px;
  color: var(--v-ink);
  padding: 8px 14px;
  background: var(--v-bg);
  border-radius: 8px;
  border-left: 2px solid var(--v-teal);
}
.disclaimer-divider {
  height: 1px;
  background: var(--v-border);
  margin: 20px 0;
}
.disclaimer-legal {
  font-size: 12px;
  color: var(--v-subtle);
  line-height: 1.7;
}
.disclaimer-footer {
  padding: 16px 28px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid var(--v-border);
  background: var(--v-bg);
}
.disclaimer-scroll-hint {
  font-size: 12px;
  color: var(--v-subtle);
}

/* ── Director dialog ────────────────────────────────────────────────────── */
.director-dialog-card {
  background: #ffffff !important;
  border: 1px solid var(--v-border) !important;
  border-radius: 16px !important;
  color: var(--v-ink) !important;
  box-shadow: var(--v-shadow-d) !important;
}
.director-dialog-head {
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--v-border);
  font-size: 15px;
  font-weight: 700;
  color: var(--v-ink);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--v-bg);
}
.director-dialog-body {
  padding: 20px 24px;
}
.director-dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--v-border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: var(--v-bg);
}
.director-dialog-card :deep(.v-field) {
  background: var(--v-field) !important;
  color: var(--v-ink) !important;
}
.director-dialog-card :deep(.v-field__outline) {
  --v-field-border-color: var(--v-border-d) !important;
}
.director-dialog-card :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: var(--v-teal) !important;
}
.director-dialog-card :deep(.v-label) {
  color: var(--v-muted) !important;
}
.director-dialog-card :deep(.v-field__input) {
  color: var(--v-ink) !important;
}
.director-dialog-card :deep(.v-select__selection) {
  color: var(--v-ink) !important;
}
.director-dialog-card :deep(.v-checkbox .v-label) {
  color: var(--v-ink) !important;
  font-size: 13px !important;
}

/* ── Success dialog ──────────────────────────────────────────────────────── */
.success-card {
  background: #ffffff !important;
  border: 1px solid var(--v-border) !important;
  border-radius: 16px !important;
  color: var(--v-ink) !important;
  padding: 32px 28px 28px;
  text-align: center;
  box-shadow: var(--v-shadow-d) !important;
}
.success-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.success-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid var(--v-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 8px rgba(0, 201, 177, 0.08);
  background: var(--v-teal-lt);
}
.success-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--v-ink);
  margin-bottom: 6px;
}
.success-sub {
  font-size: 14px;
  color: var(--v-muted);
  margin-bottom: 24px;
}
.ref-box {
  background: var(--v-teal-lt);
  border: 1px solid rgba(0, 201, 177, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 0 auto 20px;
  display: inline-block;
  min-width: 240px;
}
.ref-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  margin-bottom: 6px;
}
.ref-value {
  font-size: 22px;
  font-weight: 600;
  color: white;
  letter-spacing: 2px;
}
.success-hint {
  font-size: 13px;
  color: var(--v-muted);
  line-height: 1.7;
}
</style>
