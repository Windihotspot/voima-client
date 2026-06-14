<template>
  <v-app>
    <div class="onboarding-root">
      <!-- Header -->
      <div class="ob-header">
        <div class="ob-header-inner">
          <div class="ob-logo">
            <img src="@/assets/paratus-logo.jpeg" class="w-40 h-20" alt="" />
          </div>
          <div class="ob-header-sub">Account Application</div>
        </div>
        <div class="ob-progress-wrap">
          <div class="ob-progress-track">
            <div class="ob-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="ob-progress-steps">
            <div
              v-for="(s, i) in steps"
              :key="i"
              class="ob-step-dot"
              :class="{ active: currentStep === i, done: currentStep > i }"
              @click="goToStep(i)"
            >
              <span class="ob-step-num">{{ i + 1 }}</span>
              <span class="ob-step-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <v-dialog v-model="showDisclaimer" max-width="680" persistent>
        <v-card class="pa-6">
          <div class="text-center mb-4">
            <v-icon size="48" color="primary">mdi-information-outline</v-icon>
            <h2 class="text-h6 mt-2 font-weight-bold">Important Disclaimer</h2>
          </div>

          <v-card-text class="text-body-2 pa-0">
            <div
              style="
                max-height: 300px;
                overflow-y: auto;
                padding: 16px;
                line-height: 1.7;
                color: #374151;
              "
              @scroll="handleScroll"
            >
              <p>
                To support the submission of your account opening documents to the preferred bank,
                enabling the bank to open an account for you for facility disbursement.
              </p>

              <p class="mt-3">
                Please note: All required KYC documents will be reviewed and verified before your
                account number is issued. This process takes <strong>2 to 24 hours</strong> after
                submission.
              </p>

              <p class="mt-3 font-weight-medium">
                Before you proceed, ensure you have the following ready:
              </p>

              <ul class="mt-2 ml-4">
                <li>A valid means of identification (NIN or International Passport)</li>
                <li>A recent passport photograph, taken with your phone</li>
                <li>A utility bill, not older than 3 months</li>
                <li>Your signature on a plain sheet, snapped and uploaded</li>
              </ul>

              <v-divider class="my-4"></v-divider>

              <p class="font-weight-bold">Disclaimer</p>

              <p>
                By proceeding, you confirm that you understand and accept this process. You
                authorize <strong>Paratus Banca Ltd</strong> to submit your details/data and
                generate an account with a preferred partner bank for the purpose of facility
                disbursement.
              </p>

              <p class="mt-2">
                You confirm that you are aware of the requirements, verification steps, and
                timelines involved, and that the information provided is accurate.
              </p>
            </div>
          </v-card-text>

          <v-card-actions class="justify-end mt-4">
            <!-- <v-btn
        variant="text"
        color="grey"
        @click="showDisclaimer = false"
      >
        Cancel
      </v-btn> -->

            <v-btn
              :disabled="!scrolledToBottom"
              color="primary"
              variant="flat"
              @click="acceptDisclaimer"
            >
              I Understand & Continue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Notice banner -->
      <div class="ob-body">
        <div class="ob-notice">
          <v-icon class="ob-notice-icon" size="18">mdi-information-outline</v-icon>

          <span class="ob-notice-text">
            <span>
              All KYC documents will be thoroughly reviewed before your account number is issued —
              usually within
              <strong>2 – 24 hours</strong> of submission.
            </span>

            <span class="ob-notice-sub">
              The application is simple and takes less than <strong>10 minutes</strong> to complete.
            </span>
          </span>
        </div>
      </div>

      <!-- Form Body -->
      <div class="ob-body">
        <!-- ── STEP 0: Personal Info ── -->
        <v-form ref="step0Form" @submit.prevent v-show="currentStep === 0">
          <div class="ob-section">
            <div class="ob-section-title">
              <span class="ob-section-num">01</span>
              Personal Information
            </div>
            <div class="ob-grid-2">
              <v-text-field
                v-model="form.bvn"
                label="BVN (Bank Verification Number)"
                variant="outlined"
                density="comfortable"
                :rules="[required, bvnRule]"
                maxlength="11"
                hint="11-digit BVN"
                persistent-hint
                class="ob-field"
              />
              <v-text-field
                v-model="form.nin"
                label="NIN (National Identification Number)"
                variant="outlined"
                density="comfortable"
                :rules="[required, ninRule]"
                maxlength="11"
                hint="11-digit NIN"
                persistent-hint
                class="ob-field"
              />
            </div>

            <div class="ob-card-info">
              <div class="ob-card-info-title">
                <v-icon size="18" class="mr-1">mdi-sim-outline</v-icon>
                BVN Phone Number Access
              </div>
              <div class="ob-card-info-sub">
                The phone number linked to your BVN must remain active. Account opening pulls your
                BVN details during generation.
              </div>
              <v-radio-group
                v-model="form.bvn_phone_accessible"
                :rules="[required]"
                hide-details="auto"
                class="mt-2"
              >
                <v-radio
                  label="Yes, I have access to my BVN phone number"
                  :value="true"
                  color="primary"
                />
                <v-radio label="No, I don't have access" :value="false" color="error" />
              </v-radio-group>
              <v-text-field
                v-if="form.bvn_phone_accessible === true"
                v-model="form.bvn_phone_number"
                label="Confirm BVN Phone Number"
                variant="outlined"
                density="comfortable"
                prefix="+234"
                maxlength="10"
                :rules="[required, phoneRule]"
                class="ob-field mt-3"
              />
            </div>
            <div class="ob-grid-3 mt-4">
              <v-text-field
                v-model="form.first_name"
                label="First Name"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.middle_name"
                label="Middle Name"
                variant="outlined"
                density="comfortable"
                class="ob-field"
              />
              <v-text-field
                v-model="form.last_name"
                label="Last Name"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>

            <div class="ob-grid-2">
              <div class="ob-radio-group">
                <div class="ob-radio-label">Sex Identity <span class="ob-required">*</span></div>
                <v-radio-group v-model="form.sex" inline :rules="[required]" hide-details="auto">
                  <v-radio label="Male" value="male" color="primary" />
                  <v-radio label="Female" value="female" color="primary" />
                </v-radio-group>
              </div>
              <div class="ob-radio-group">
                <div class="ob-radio-label">Religion <span class="ob-required">*</span></div>
                <v-radio-group
                  v-model="form.religion"
                  inline
                  :rules="[required]"
                  hide-details="auto"
                >
                  <v-radio label="Christian" value="christian" color="primary" />
                  <v-radio label="Islam" value="islam" color="primary" />
                  <v-radio label="Others" value="others" color="primary" />
                </v-radio-group>
              </div>
            </div>

            <div class="ob-grid-3">
              <v-menu
                v-model="dobMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="form.date_of_birth"
                    label="Date of Birth"
                    variant="outlined"
                    readonly
                    v-bind="props"
                    :rules="[required, isAdultRule]"
                  />
                </template>

                <v-date-picker
                  color="red"
                  v-model="dob"
                  :max="maxAllowedDate"
                  @update:model-value="onDobSelect"
                />
              </v-menu>
              <v-text-field
                v-model="form.place_of_birth"
                label="Place of Birth"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-select
                v-model="form.state_of_origin"
                :items="nigerianStates"
                label="State of Origin"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>

            <div class="ob-grid-2">
              <v-text-field
                v-model="form.lga_of_origin"
                label="LGA of State of Origin"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.mothers_maiden_name"
                label="Mother's Maiden Name"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>

            <div class="ob-grid-2">
              <v-text-field
                v-model="form.phone_number"
                label="Phone Number"
                variant="outlined"
                density="comfortable"
                prefix="+234"
                :rules="[required, phoneRule]"
                hint="Active & preferred WhatsApp number"
                persistent-hint
                maxlength="10"
                class="ob-field"
              />
              <v-text-field
                v-model="form.email"
                label="Email Address"
                variant="outlined"
                density="comfortable"
                :rules="[required, emailRule]"
                class="ob-field"
              />
              <v-select
                v-model="form.marital_status"
                :items="maritalStatus"
                label="Marital Status"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
          </div>
        </v-form>

        <!-- ── STEP 1: Address ── -->
        <v-form ref="step1Form" @submit.prevent v-show="currentStep === 1">
          <div class="ob-section">
            <div class="ob-section-title">
              <span class="ob-section-num">02</span>
              Address Information
            </div>
            <v-text-field
              v-model="form.address.full_address"
              label="Full Address"
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              class="ob-field"
            />
            <div class="ob-grid-2">
              <v-text-field
                v-model="form.address.town_village"
                label="Town / Village"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.address.lga"
                label="Local government area"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-select
                v-model="form.address.state"
                :items="nigerianStates"
                label="State"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
            <div class="ob-grid-2">
              <v-text-field
                v-model="form.address.roof_color"
                label="Roof Color of Your House"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.address.gate_color"
                label="Color of the Gate"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
            <div class="ob-grid-2">
              <v-text-field
                v-model="form.address.nearest_landmark"
                label="Nearest Landmark to the House"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-select
                v-model="form.address.building_type"
                :items="buildingTypes"
                label="Building Type"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
            <v-textarea
              v-model="form.address.bus_stop_description"
              label="Description from Nearest Bus Stop"
              variant="outlined"
              density="comfortable"
              rows="4"
              :rules="[required]"
              hint="Include available transport (bus, bike, or tricycle) to your address"
              persistent-hint
              class="ob-field"
            />
          </div>
        </v-form>

        <!-- ── STEP 2: Next of Kin ── -->
        <v-form ref="step2Form" @submit.prevent v-show="currentStep === 2">
          <div class="ob-section">
            <div class="ob-section-title">
              <span class="ob-section-num">03</span>
              Next of Kin Details
            </div>
            <div class="ob-grid-2">
              <v-text-field
                v-model="form.next_of_kin.full_name"
                label="Full Name of Next of Kin"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-select
                v-model="form.next_of_kin.relationship"
                :items="relationships"
                label="Relationship"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
            <div class="ob-grid-2">
              <v-menu
                v-model="nokDobMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="form.next_of_kin.date_of_birth"
                    label="Next of Kin Date of Birth"
                    variant="outlined"
                    readonly
                    v-bind="props"
                  />
                </template>

                <v-date-picker color="red" v-model="nokDob" @update:model-value="onNokDobSelect" />
              </v-menu>
              <v-text-field
                v-model="form.next_of_kin.place_of_birth"
                label="Place of Birth"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.next_of_kin.address"
                label="Address"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </div>
            <v-text-field
              v-model="form.next_of_kin.phone_number"
              label="Phone Number (WhatsApp preferred)"
              variant="outlined"
              density="comfortable"
              prefix="+234"
              :rules="[required, phoneRule]"
              maxlength="10"
              class="ob-field"
              style="max-width: 380px"
            />
          </div>
        </v-form>

        <!-- ── STEP 3: Employment ── -->
        <v-form ref="step3Form" @submit.prevent v-show="currentStep === 3">
          <div class="ob-section">
            <div class="ob-section-title">
              <span class="ob-section-num">04</span>
              Employment Details
            </div>
            <div class="ob-radio-group mb-4">
              <div class="ob-radio-label">Employment Status <span class="ob-required">*</span></div>
              <v-radio-group
                v-model="form.employment.employment_status"
                inline
                :rules="[required]"
                hide-details="auto"
              >
                <v-radio label="Employed" value="employed" color="primary" />
                <v-radio label="Student" value="student" color="primary" />
                <v-radio label="Business Owner" value="business_owner" color="primary" />
              </v-radio-group>
            </div>

            <template v-if="form.employment.employment_status === 'employed'">
              <v-text-field
                v-model="form.employment.employer_name"
                label="Name of Employer"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
              <v-text-field
                v-model="form.employment.employer_address"
                label="Address of Employer"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </template>
            <template v-if="form.employment.employment_status === 'student'">
              <v-text-field
                v-model="form.employment.school_name"
                label="Name of School"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                class="ob-field"
              />
            </template>
            <template v-if="form.employment.employment_status === 'business_owner'">
              <div class="ob-grid-2">
                <v-text-field
                  v-model="form.employment.business_type"
                  label="Type of Business / Trade"
                  variant="outlined"
                  density="comfortable"
                  :rules="[required]"
                  class="ob-field"
                />
                <v-text-field
                  v-model="form.employment.business_location"
                  label="Location of Business"
                  variant="outlined"
                  density="comfortable"
                  :rules="[required]"
                  class="ob-field"
                />
              </div>
            </template>

            <v-textarea
              v-if="
                form.employment.employment_status &&
                form.employment.employment_status !== 'unemployed'
              "
              v-model="form.employment.additional_info"
              label="Additional Employment Information"
              variant="outlined"
              density="comfortable"
              rows="3"
              class="ob-field"
            />
          </div>
        </v-form>

        <!-- ── STEP 4: KYC Documents (no v-form needed) ── -->
        <div v-show="currentStep === 4">
          <div class="ob-section">
            <div class="ob-section-title">
              <span class="ob-section-num">05</span>
              Upload KYC Documents
            </div>
            <div class="ob-kyc-notice">
              <v-icon size="16">mdi-shield-check-outline</v-icon>
              All documents must be clear and legible. Accepted formats: JPG, PNG, PDF.
            </div>

            <div class="ob-doc-grid">
              <div
                v-for="doc in kycDocs"
                :key="doc.key"
                class="ob-doc-card"
                :class="{ uploaded: uploads[doc.key], error: uploadErrors[doc.key] }"
              >
                <div class="ob-doc-icon">
                  <v-icon size="28" :color="uploads[doc.key] ? 'success' : 'primary'">{{
                    doc.icon
                  }}</v-icon>
                </div>
                <div class="ob-doc-info">
                  <div class="ob-doc-name">
                    {{ doc.label }} <span v-if="doc.required" class="ob-required">*</span>
                  </div>
                  <div class="ob-doc-hint">{{ doc.hint }}</div>
                  <div v-if="uploads[doc.key]" class="ob-doc-uploaded">
                    <v-icon size="14" color="success">mdi-check-circle</v-icon>
                    {{ uploads[doc.key].name }}
                  </div>
                  <div v-if="uploadErrors[doc.key]" class="ob-doc-error">
                    {{ uploadErrors[doc.key] }}
                  </div>
                </div>
                <div class="ob-doc-action">
                  <v-btn
                    variant="tonal"
                    size="small"
                    :color="uploads[doc.key] ? 'success' : 'primary'"
                    @click="triggerFileInput(doc.key)"
                    :loading="uploading[doc.key]"
                  >
                    {{ uploads[doc.key] ? 'Replace' : 'Upload' }}
                  </v-btn>
                  <input
                    :ref="(el) => (fileInputs[doc.key] = el)"
                    type="file"
                    :accept="doc.accept"
                    style="display: none"
                    @change="handleFileSelect($event, doc.key, doc.docType)"
                  />
                </div>
              </div>
            </div>

            <div class="ob-section-title mt-6">
              <span class="ob-section-num">06</span>
              PoF / PoE Request (Optional)
            </div>
            <v-text-field
              v-model="pofAmount"
              label="Amount in Naira Requested"
              variant="outlined"
              density="comfortable"
              class="ob-field"
              style="max-width: 380px"
            />
            <v-select
              v-model="form.pof_facility"
              :items="banks"
              item-title="name"
              item-value="id"
              label="Select an agreed bank"
              variant="outlined"
              density="comfortable"
              class="ob-field"
              style="max-width: 380px"
            />
          </div>
        </div>

        <!-- ── STEP 5: Review & Submit ── -->
        <div v-show="currentStep === 5">
          <div class="ob-section">
            <div class="ob-section-title">
              <span class="ob-section-num">06</span>
              Review & Submit
            </div>

            <div class="ob-review-grid">
              <div class="ob-review-card" @click="goToStep(0)">
                <div class="ob-review-card-head">
                  <v-icon size="16">mdi-account-outline</v-icon> Personal Info
                  <v-icon size="16" class="ml-auto">mdi-pencil-outline</v-icon>
                </div>
                <div class="ob-review-row">
                  <span>Name</span><span>{{ fullName }}</span>
                </div>
                <div class="ob-review-row">
                  <span>BVN</span><span>{{ maskedBvn }}</span>
                </div>
                <div class="ob-review-row">
                  <span>NIN</span><span>{{ maskedNin }}</span>
                </div>
                <div class="ob-review-row">
                  <span>DOB</span><span>{{ form.date_of_birth }}</span>
                </div>
                <div class="ob-review-row">
                  <span>Phone</span><span>+234{{ form.phone_number }}</span>
                </div>
                <div class="ob-review-row">
                  <span>Email</span><span>{{ form.email }}</span>
                </div>
              </div>

              <div class="ob-review-card" @click="goToStep(1)">
                <div class="ob-review-card-head">
                  <v-icon size="16">mdi-map-marker-outline</v-icon> Address
                  <v-icon size="16" class="ml-auto">mdi-pencil-outline</v-icon>
                </div>
                <div class="ob-review-row">
                  <span>Address</span><span>{{ form.address.full_address }}</span>
                </div>
                <div class="ob-review-row">
                  <span>State</span><span>{{ form.address.state }}</span>
                </div>
                <div class="ob-review-row">
                  <span>Landmark</span><span>{{ form.address.nearest_landmark }}</span>
                </div>
                <div class="ob-review-row">
                  <span>Building</span><span>{{ form.address.building_type }}</span>
                </div>
              </div>

              <div class="ob-review-card" @click="goToStep(2)">
                <div class="ob-review-card-head">
                  <v-icon size="16">mdi-account-heart-outline</v-icon> Next of Kin
                  <v-icon size="16" class="ml-auto">mdi-pencil-outline</v-icon>
                </div>
                <div class="ob-review-row">
                  <span>Name</span><span>{{ form.next_of_kin.full_name }}</span>
                </div>
                <div class="ob-review-row">
                  <span>Relationship</span><span>{{ form.next_of_kin.relationship }}</span>
                </div>
                <div class="ob-review-row">
                  <span>Phone</span><span>+234{{ form.next_of_kin.phone_number }}</span>
                </div>
              </div>

              <div class="ob-review-card" @click="goToStep(3)">
                <div class="ob-review-card-head">
                  <v-icon size="16">mdi-briefcase-outline</v-icon> Employment
                  <v-icon size="16" class="ml-auto">mdi-pencil-outline</v-icon>
                </div>
                <div class="ob-review-row">
                  <span>Status</span><span>{{ form.employment.employment_status }}</span>
                </div>
                <div class="ob-review-row" v-if="form.employment.employer_name">
                  <span>Employer</span><span>{{ form.employment.employer_name }}</span>
                </div>
                <div class="ob-review-row" v-if="form.employment.school_name">
                  <span>School</span><span>{{ form.employment.school_name }}</span>
                </div>
                <div class="ob-review-row" v-if="form.employment.business_type">
                  <span>Business</span><span>{{ form.employment.business_type }}</span>
                </div>
              </div>

              <div class="ob-review-card" @click="goToStep(4)">
                <div class="ob-review-card-head">
                  <v-icon size="16">mdi-file-document-multiple-outline</v-icon> KYC Documents
                  <v-icon size="16" class="ml-auto">mdi-pencil-outline</v-icon>
                </div>
                <div v-for="doc in kycDocs" :key="doc.key" class="ob-review-row">
                  <span>{{ doc.label }}</span>
                  <span :class="uploads[doc.key] ? 'ob-status-ok' : 'ob-status-missing'">
                    <v-icon size="14">{{
                      uploads[doc.key] ? 'mdi-check-circle' : 'mdi-close-circle'
                    }}</v-icon>
                    {{ uploads[doc.key] ? 'Uploaded' : 'Missing' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="ob-declaration">
              <v-checkbox v-model="form.declaration" color="primary">
                <template #label>
                  <span class="ob-decl-text">
                    I hereby declare that all information provided is true, accurate, and complete.
                    I understand that providing false information may result in rejection of this
                    application or closure of any account opened.
                  </span>
                </template>
              </v-checkbox>
            </div>
          </div>
        </div>
      </div>
      <!-- /ob-body -->

      <!-- Navigation Footer -->
      <div class="ob-footer">
        <v-btn
          variant="text"
          color="primary"
          :disabled="currentStep === 0"
          @click="prevStep"
          class="ob-btn-back"
        >
          <v-icon start>mdi-arrow-left</v-icon> Back
        </v-btn>
        <div class="ob-footer-step-info">Step {{ currentStep + 1 }} of {{ steps.length }}</div>
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="primary"
          variant="flat"
          :loading="saving"
          @click="nextStep"
          class="ob-btn-next"
        >
          Continue <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn
          v-else
          color="success"
          variant="flat"
          :loading="submitting"
          :disabled="!form.declaration || !allRequiredDocsUploaded"
          @click="submitApplication"
          class="ob-btn-submit"
        >
          <v-icon start>mdi-send-check</v-icon> Submit Application
        </v-btn>
      </div>

      <!-- Success Dialog -->
      <v-dialog v-model="showSuccess" max-width="480" persistent>
        <v-card class="ob-success-card">
          <div class="ob-success-icon-wrap">
            <v-icon size="56" color="success">mdi-check-decagram</v-icon>
          </div>
          <v-card-title class="ob-success-title">Application Submitted!</v-card-title>
          <v-card-text class="ob-success-body">
            <p>Your account opening application has been received successfully.</p>
            <div class="ob-ref-box">
              <span class="ob-ref-label">Reference Number</span>
              <span class="ob-ref-value">{{ submittedRef }}</span>
            </div>
            <p class="ob-success-hint">
              Your account number will be issued within <strong>2 – 24 hours</strong>. You will be
              notified via the phone number and email provided.
            </p>
          </v-card-text>
          <v-card-actions class="flex flex-col sm:flex-row justify-center items-center gap-3 pb-4">
            <v-btn color="primary" variant="flat" class="w-full sm:w-auto" @click="resetForm">
              Start New Application
            </v-btn>

            <a href="https://paratusbanca.com" rel="noopener noreferrer" class="w-full sm:w-auto">
              <v-btn color="primary" variant="text" class="w-full sm:w-auto">
                Return to Home
              </v-btn>
            </a>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="5000"
        location="bottom right"
      >
        {{ snackbar.message }}
        <template #actions>
          <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { supabase } from '@/services/supabase'
import { useFormattedFields } from '@/composables/useFormattedFields'

const showDisclaimer = ref(false)
const disclaimerAccepted = ref(false)
const acceptDisclaimer = () => {
  disclaimerAccepted.value = true
  showDisclaimer.value = false
}
const dobMenu = ref(false)
const dob = ref(null) // temp picker value only

const maxAllowedDate = computed(() => {
  const today = new Date()
  today.setFullYear(today.getFullYear() - 18)
  return today.toISOString().split('T')[0]
})
const isAdultRule = (v) => {
  if (!v) return 'Date of birth is required'

  const dobDate = new Date(v)
  const today = new Date()

  const age = today.getFullYear() - dobDate.getFullYear()
  const m = today.getMonth() - dobDate.getMonth()

  const realAge = m < 0 || (m === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age

  return realAge >= 18 || 'You must be at least 18 years old'
}
const onDobSelect = (val) => {
  if (!val) return

  const date = new Date(val)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  form.date_of_birth = `${year}-${month}-${day}`

  dobMenu.value = false
}

const nokDobMenu = ref(false)
const nokDob = ref(null) // temp picker value

// const onNokDobSelect = (val) => {
//   if (!val) return

//   const date = new Date(val)

//   form.next_of_kin.date_of_birth = date.toISOString().split('T')[0]

//   nokDobMenu.value = false
// }
const onNokDobSelect = (val) => {
  if (!val) return

  const date = new Date(val)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  form.next_of_kin.date_of_birth = `${year}-${month}-${day}`

  nokDobMenu.value = false
}

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  { label: 'Personal' },
  { label: 'Address' },
  { label: 'Next of Kin' },
  { label: 'Employment' },
  { label: 'Documents' },
  { label: 'Review' }
]
const currentStep = ref(0)
const banks = ref([])
const banksLoading = ref(false)
const fetchFacilities = async () => {
  banksLoading.value = true

  const { data, error } = await supabase
    .from('bank_facilities')
    .select(
      `
      id,
      facility_type,
      facility_amount,
      borrowing_rate,
      banks:bank_id (name)
    `
    )
    .eq('status', 'active')

  if (!error) {
    banks.value = (data || []).map((f) => ({
      id: f.id,
      name: f.banks?.name || 'Unknown Bank'
    }))
    console.log('facilities:', banks.value)
  } else {
    showSnack('Failed to load facilities')
  }

  banksLoading.value = false
}
onMounted(() => {
  fetchFacilities()
  showDisclaimer.value = true
})
// ── One ref per step form ─────────────────────────────────────────────────────
// THE FIX: each v-form gets its own ref so .validate() only touches that
// step's fields — not every field in the whole wizard.
const step0Form = ref(null)
const step1Form = ref(null)
const step2Form = ref(null)
const step3Form = ref(null)

const stepFormMap = {
  0: step0Form,
  1: step1Form,
  2: step2Form,
  3: step3Form
  // steps 4 & 5 have no v-form — handled manually in validateCurrentStep()
}

const saving = ref(false)
const submitting = ref(false)
const showSuccess = ref(false)
const submittedRef = ref('')
const applicationId = ref(null)

// ── Form state ────────────────────────────────────────────────────────────────
const form = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  sex: null,
  religion: null,
  bvn: '',
  nin: '',
  date_of_birth: '',
  place_of_birth: '',
  state_of_origin: '',
  lga_of_origin: '',
  phone_number: '',
  email: '',
  mothers_maiden_name: '',
  bvn_phone_accessible: null,
  bvn_phone_number: '',
  marital_status: '',
  pof_amount_requested: null,
  declaration: false,
  address: {
    full_address: '',
    town_village: '',
    lga: '',
    state: '',
    roof_color: '',
    gate_color: '',
    nearest_landmark: '',
    building_type: null,
    bus_stop_description: ''
  },
  next_of_kin: {
    full_name: '',
    relationship: null,
    date_of_birth: '',
    address: '',
    place_of_birth: '',
    phone_number: ''
  },
  employment: {
    employment_status: null,
    employer_name: '',
    employer_address: '',
    school_name: '',
    business_type: '',
    business_location: '',
    additional_info: ''
  }
})
const pofAmount = useFormattedFields({ value: form }, 'pof_amount_requested', { currency: true })
// ── KYC file tracking ─────────────────────────────────────────────────────────
const uploads = reactive({})
const uploadErrors = reactive({})
const uploading = reactive({})
const fileInputs = reactive({})

const kycDocs = [
  {
    key: 'international_passport',
    docType: 'international_passport',
    label: 'International Passport',
    hint: 'Clear photo of data page',
    icon: 'mdi-passport',
    accept: 'image/*,.pdf',
    required: false
  },
  {
    key: 'nin_slip',
    docType: 'nin_slip',
    label: 'NIN Slip / Card',
    hint: 'NIN slip or card, clearly readable',
    icon: 'mdi-card-account-details-outline',
    accept: 'image/*,.pdf',
    required: true
  },
  {
    key: 'utility_bill',
    docType: 'utility_bill',
    label: 'Utility Bill',
    hint: 'Not older than 3 months',
    icon: 'mdi-file-document-outline',
    accept: 'image/*,.pdf',
    required: true
  },
  {
    key: 'signature',
    docType: 'signature',
    label: 'Signature',
    hint: 'Sign on plain paper, snap & upload',
    icon: 'mdi-draw',
    accept: 'image/*',
    required: true
  },
  {
    key: 'passport_photo',
    docType: 'passport_photo',
    label: 'Passport Photo',
    hint: 'Plain background, phone is fine',
    icon: 'mdi-camera-account',
    accept: 'image/*',
    required: true
  }
]

const allRequiredDocsUploaded = computed(() =>
  kycDocs.filter((d) => d.required).every((d) => uploads[d.key])
)

// ── Computed ──────────────────────────────────────────────────────────────────
const fullName = computed(() =>
  [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(' ')
)
const maskedBvn = computed(() => (form.bvn ? '*'.repeat(7) + form.bvn.slice(-4) : ''))
const maskedNin = computed(() => (form.nin ? '*'.repeat(7) + form.nin.slice(-4) : ''))
const progressPercent = computed(() => Math.round((currentStep.value / (steps.length - 1)) * 100))

// ── Validation rules ──────────────────────────────────────────────────────────
const required = (v) =>
  (v !== null && v !== undefined && String(v).trim() !== '') || 'This field is required'
const emailRule = (v) => /.+@.+\..+/.test(v) || 'Enter a valid email'
const phoneRule = (v) => /^\d{10}$/.test(v) || 'Enter a valid 10-digit number (without +234)'
const bvnRule = (v) => /^\d{11}$/.test(v) || 'BVN must be 11 digits'
const ninRule = (v) => /^\d{11}$/.test(v) || 'NIN must be 11 digits'

// ── Snackbar ──────────────────────────────────────────────────────────────────
const snackbar = reactive({ show: false, message: '', color: 'error' })
const showSnack = (message, color = 'error') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// ── Validate only the current step's form ─────────────────────────────────────
const validateCurrentStep = async () => {
  if (currentStep.value === 4) {
    // Doc step: just check required docs
    if (!allRequiredDocsUploaded.value) {
      showSnack('Please upload all required KYC documents (marked with *) before continuing.')
      return false
    }
    return true
  }
  if (currentStep.value === 5) return true // review step — no v-form

  const formRef = stepFormMap[currentStep.value]?.value
  if (!formRef) return true

  const { valid } = await formRef.validate()
  if (!valid) {
    showSnack('Please fill in all required fields before continuing.')
  }
  return valid
}

// ── Navigation ────────────────────────────────────────────────────────────────
const goToStep = (i) => {
  if (i < currentStep.value) currentStep.value = i
}
const scrolledToBottom = ref(false)
const handleScroll = (e) => {
  const el = e.target
  scrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 10
}
const nextStep = async () => {
  if (!disclaimerAccepted.value) {
    showDisclaimer.value = true
    return
  }
  const valid = await validateCurrentStep()
  if (!valid) return

  if (currentStep.value === 0) {
    try {
      await saveApplicationDraft()
    } catch {
      return
    }
  }

  if (currentStep.value === 4) {
    if (form.pof_amount_requested && !form.pof_facility) {
      showSnack('Please select a facility')
      return false
    }

    if (form.pof_facility && !form.pof_amount_requested) {
      showSnack('Please enter PoF amount')
      return false
    }
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
const savePoF = async () => {
  if (!applicationId.value) await saveApplicationDraft()
  const payload = {
    p_application_id: applicationId.value,
    p_pof_amount: form.pof_amount_requested,
    p_pof_facility: form.pof_facility
  }
  console.log('payload', payload)
  const { data, error } = await supabase.rpc('update_customer_pof', {
    p_application_id: applicationId.value,
    p_pof_amount: form.pof_amount_requested,
    p_pof_facility: form.pof_facility
  })
  console.log('data:', data)

  if (error) {
    showSnack('Failed to save PoF: ' + error.message)
    throw error
  }
}
// ── Save draft ────────────────────────────────────────────────────────────────
const saveApplicationDraft = async () => {
  saving.value = true

  try {
    const payload = {
      p_id: applicationId.value,
      p_first_name: form.first_name,
      p_middle_name: form.middle_name || null,
      p_last_name: form.last_name,
      p_sex: form.sex,
      p_religion: form.religion,
      p_bvn: form.bvn,
      p_nin: form.nin,
      p_date_of_birth: form.date_of_birth,
      p_place_of_birth: form.place_of_birth,
      p_state_of_origin: form.state_of_origin,
      p_lga_of_origin: form.lga_of_origin,
      p_phone_number: form.phone_number ? '+234' + form.phone_number : null,
      p_email: form.email,
      p_mothers_maiden_name: form.mothers_maiden_name,
      p_bvn_phone_accessible: form.bvn_phone_accessible,
      p_marital_status: form.marital_status,
      p_bvn_phone_number: form.bvn_phone_number ? '+234' + form.bvn_phone_number : null
      // p_pof_amount_requested: form.pof_amount_requested || null,
      // p_pof_facility: form.pof_facility || null,
    }
    console.log('upsert application payload:', payload)
    console.log({
      applicationId: applicationId.value,
      pof_facility: form.pof_facility
    })
    const { data, error } = await supabase.rpc('upsert_customer_application_v2', {
      p_id: applicationId.value,
      p_first_name: form.first_name,
      p_middle_name: form.middle_name || null,
      p_last_name: form.last_name,
      p_sex: form.sex,
      p_religion: form.religion,
      p_bvn: form.bvn,
      p_nin: form.nin,
      p_date_of_birth: form.date_of_birth,
      p_place_of_birth: form.place_of_birth,
      p_state_of_origin: form.state_of_origin,
      p_lga_of_origin: form.lga_of_origin,
      p_phone_number: form.phone_number ? '+234' + form.phone_number : null,
      p_email: form.email,
      p_mothers_maiden_name: form.mothers_maiden_name,
      p_bvn_phone_accessible: form.bvn_phone_accessible,
      p_marital_status: form.marital_status,
      p_bvn_phone_number: form.bvn_phone_number ? '+234' + form.bvn_phone_number : null,
      p_pof_amount_requested: form.pof_amount_requested || null,
      p_pof_facility: form.pof_facility || null
    })
    console.log('customer application:', data)
    if (error) throw error
    applicationId.value = data
  } catch (err) {
    console.log('error:', err)
    showSnack('Failed to save your application: ' + err.message)
    throw err
  } finally {
    saving.value = false
  }
}
watch(
  () => form.pof_facility,
  async (val) => {
    if (val && form.pof_amount_requested) {
      await savePoF()
    }
  }
)

watch(
  () => form.pof_amount_requested,
  async (val) => {
    if (val && form.pof_facility) {
      await savePoF()
    }
  }
)
// ── File upload ───────────────────────────────────────────────────────────────
const triggerFileInput = (key) => fileInputs[key]?.click()
const sanitizeFileName = (name) => {
  return name
    .replace(/\s+/g, '_') // spaces → _
    .replace(/[^a-zA-Z0-9._-]/g, '') // remove weird chars
}

const handleFileSelect = async (event, key, docType) => {
  const file = event.target.files[0]

  if (!file) return
  const safeFileName = sanitizeFileName(file.name)
  if (file.size > 5 * 1024 * 1024) {
    uploadErrors[key] = 'File too large. Maximum size is 5MB.'
    return
  }
  delete uploadErrors[key]
  uploading[key] = true
  try {
    if (!applicationId.value) await saveApplicationDraft()

    const { data: rpcData, error: rpcError } = await supabase.rpc('upload_kyc_document', {
      p_application_id: applicationId.value,
      p_doc_type: docType,
      p_file_name: safeFileName,
      p_mime_type: file.type,
      p_file_size_bytes: file.size
    })
    if (rpcError) throw rpcError

    const { storagePath, bucket } = rpcData

    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket || 'kyc-documents')
      .createSignedUploadUrl(storagePath)
    if (signedError) throw signedError
    console.log('error:', signedError)

    const uploadRes = await fetch(signedData.signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    })
    if (!uploadRes.ok) throw new Error('Storage upload failed')

    const { error: confirmError } = await supabase.rpc('confirm_kyc_upload', {
      p_application_id: applicationId.value,
      p_doc_type: docType,
      p_storage_path: storagePath
    })
    if (confirmError) throw confirmError

    uploads[key] = file
    showSnack('Document uploaded successfully', 'success')
  } catch (err) {
    uploadErrors[key] = 'Upload failed: ' + err.message
    showSnack('Document upload failed: ' + err.message)
  } finally {
    uploading[key] = false
    event.target.value = ''
  }
}

// ── Final submission ──────────────────────────────────────────────────────────
const submitApplication = async () => {
  if (!form.declaration) {
    showSnack('Please accept the declaration to proceed.')
    return
  }
  if (!allRequiredDocsUploaded.value) {
    showSnack('Please upload all required KYC documents.')
    return
  }
  submitting.value = true
  try {
    const { data, error } = await supabase.rpc('submit_full_applicationv5', {
      p_application_id: applicationId.value,
      p_full_address: form.address.full_address,
      p_town_village: form.address.town_village,
      p_lga: form.address.lga,
      p_address_state: form.address.state,
      p_roof_color: form.address.roof_color,
      p_gate_color: form.address.gate_color,
      p_nearest_landmark: form.address.nearest_landmark,
      p_building_type: form.address.building_type,
      p_bus_stop_description: form.address.bus_stop_description,
      p_nok_full_name: form.next_of_kin.full_name,
      p_nok_relationship: form.next_of_kin.relationship,
      p_nok_dob: form.next_of_kin.date_of_birth,
      p_nok_place_of_birth: form.next_of_kin.place_of_birth,
      p_nok_address: form.next_of_kin.address,
      p_nok_phone: '+234' + form.next_of_kin.phone_number,
      p_employment_status: form.employment.employment_status,
      p_employer_name: form.employment.employer_name || null,
      p_employer_address: form.employment.employer_address || null,
      p_school_name: form.employment.school_name || null,
      p_business_type: form.employment.business_type || null,
      p_business_location: form.employment.business_location || null,
      p_additional_info: form.employment.additional_info || null
    })
    if (error) throw error
    submittedRef.value = [form.first_name, form.middle_name, form.last_name]
      .filter(Boolean)
      .join(' ')
    showSuccess.value = true

    // 🚀 CALL EDGE FUNCTION (SEND EMAIL)
    try {
      await fetch('https://ytvqldflnqwflahxjjzu.supabase.co/functions/v1/bright-responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          application_id: applicationId.value,
          performed_by: 'applicant' // optional
        })
      })
    } catch (emailErr) {
      console.error('Email trigger failed:', emailErr)
      // ❗ Don't block user flow if email fails
    }
  } catch (err) {
    showSnack('Submission failed: ' + err.message)
  } finally {
    submitting.value = false
  }
}
const resetPoF = () => {
  form.pof_amount_requested = null
  form.pof_facility = null
}

// ── Reset ─────────────────────────────────────────────────────────────────────
const resetForm = () => {
  resetPoF()
  showSuccess.value = false
  applicationId.value = null
  currentStep.value = 0
  step0Form.value?.reset()
  step1Form.value?.reset()
  step2Form.value?.reset()
  step3Form.value?.reset()
  Object.assign(form, {
    first_name: '',
    middle_name: '',
    last_name: '',
    sex: null,
    religion: null,
    bvn: '',
    nin: '',
    date_of_birth: '',
    place_of_birth: '',
    state_of_origin: '',
    lga_of_origin: '',
    phone_number: '',
    email: '',
    mothers_maiden_name: '',
    marital_status: '',
    bvn_phone_accessible: null,
    bvn_phone_number: '',
    pof_amount_requested: null,
    declaration: false,
    address: {
      full_address: '',
      town_village: '',
      lga: '',
      state: '',
      roof_color: '',
      gate_color: '',
      nearest_landmark: '',
      building_type: null,
      bus_stop_description: ''
    },
    next_of_kin: {
      full_name: '',
      relationship: null,
      date_of_birth: '',
      place_of_birth: '',
      phone_number: '',
      address: ''
    },
    employment: {
      employment_status: null,
      employer_name: '',
      employer_address: '',
      school_name: '',
      business_type: '',
      business_location: '',
      additional_info: ''
    }
  })
  Object.keys(uploads).forEach((k) => delete uploads[k])
  Object.keys(uploadErrors).forEach((k) => delete uploadErrors[k])
}

// ── Static data ───────────────────────────────────────────────────────────────
const maritalStatus = ['Married', 'Single', 'Divorced', 'Separated', 'Widowed']
const nigerianStates = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory (Abuja)'
]
const buildingTypes = [
  { title: 'Bungalow', value: 'bungalow' },
  { title: 'Duplex', value: 'duplex' },
  { title: 'Blocks of Flats', value: 'blocks_of_flats' },
  { title: 'Storey Building', value: 'storey_building' },
  { title: 'A Shop', value: 'shop' }
]
const relationships = [
  { title: 'Brother', value: 'brother' },
  { title: 'Sister', value: 'sister' },
  { title: 'Father', value: 'father' },
  { title: 'Mother', value: 'mother' },
  { title: 'Wife', value: 'wife' },
  { title: 'Husband', value: 'husband' },
  { title: 'Other', value: 'other' }
]
</script>

<style scoped>
.onboarding-root {
  min-height: 100vh;
  background: #f4f6fb;
  font-family: 'Segoe UI', 'Inter', sans-serif;
  padding-bottom: 120px;
}
.ob-header {
  background: #fff;
  border-bottom: 1px solid #e8eaf0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.ob-header-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 14px 24px 8px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.ob-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ob-logo-mark {
  background: #c61d1e;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 6px;
  letter-spacing: 1px;
}
.ob-logo-text {
  font-size: 15px;
  font-weight: 600;
  color: #c61d1e;
}
.ob-header-sub {
  margin-left: auto;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}
.ob-progress-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 8px 24px 12px;
}
.ob-progress-track {
  height: 4px;
  background: #e5e7eb;
  border-radius: 99px;
  margin-bottom: 12px;
  overflow: hidden;
}
.ob-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c61d1e, #2563eb);
  border-radius: 99px;
  transition: width 0.4s ease;
}
.ob-progress-steps {
  display: flex;
  justify-content: space-between;
}
.ob-step-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 4px;
}
.ob-step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.ob-step-dot.active .ob-step-num {
  background: #c61d1e;
  color: #fff;
  box-shadow: 0 0 0 3px rgba(26, 58, 107, 0.2);
}
.ob-step-dot.done .ob-step-num {
  background: #16a34a;
  color: #fff;
}
.ob-step-label {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}
.ob-step-dot.active .ob-step-label {
  color: #c61d1e;
  font-weight: 600;
}
.ob-step-dot.done .ob-step-label {
  color: #16a34a;
}

.ob-notice {
  max-width: 900px;
  margin: 24px auto;
  padding: 10px 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  font-size: 13px;
  color: #1e40af;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
}

.ob-notice-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.ob-body {
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
}

.ob-section {
  background: #fff;
  border-radius: 14px;
  padding: 28px 28px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}
.ob-section-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ob-section-num {
  background: #c61d1e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 1px;
}
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
@media (max-width: 640px) {
  .ob-grid-2,
  .ob-grid-3 {
    grid-template-columns: 1fr;
  }
}
.ob-field {
  margin-bottom: 6px;
}
.ob-radio-group {
  margin-bottom: 16px;
}
.ob-radio-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}
.ob-required {
  color: #dc2626;
}

.ob-card-info {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px 18px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.ob-card-info-title {
  font-size: 13px;
  font-weight: 700;
  color: #c61d1e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}
.ob-card-info-sub {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.ob-kyc-notice {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #166534;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.ob-doc-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ob-doc-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.ob-doc-card.uploaded {
  border-color: #86efac;
  background: #f0fdf4;
}
.ob-doc-card.error {
  border-color: #fca5a5;
  background: #fef2f2;
}
.ob-doc-icon {
  flex-shrink: 0;
}
.ob-doc-info {
  flex: 1;
  min-width: 0;
}
.ob-doc-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}
.ob-doc-hint {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}
.ob-doc-uploaded {
  font-size: 11px;
  color: #16a34a;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.ob-doc-error {
  font-size: 11px;
  color: #dc2626;
  margin-top: 4px;
}
.ob-doc-action {
  flex-shrink: 0;
}

.ob-review-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}
@media (max-width: 640px) {
  .ob-review-grid {
    grid-template-columns: 1fr;
  }
}
.ob-review-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
}
.ob-review-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}
.ob-review-card-head {
  font-size: 12px;
  font-weight: 700;
  color: #c61d1e;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.ob-review-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 8px;
}
.ob-review-row span:first-child {
  color: #9ca3af;
  flex-shrink: 0;
}
.ob-review-row span:last-child {
  color: #111827;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
}
.ob-status-ok {
  color: #16a34a !important;
  display: flex;
  align-items: center;
  gap: 3px;
}
.ob-status-missing {
  color: #dc2626 !important;
  display: flex;
  align-items: center;
  gap: 3px;
}

.ob-declaration {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 16px;
}
.ob-decl-text {
  font-size: 13px;
  color: #78350f;
  line-height: 1.6;
}

.ob-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
.ob-footer-step-info {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}
.ob-btn-back {
  min-width: 100px;
}
.ob-btn-next {
  min-width: 130px;
}
.ob-btn-submit {
  min-width: 180px;
}

.ob-success-card {
  text-align: center;
  padding: 24px 16px 8px;
}
.ob-success-icon-wrap {
  margin-bottom: 12px;
}
.ob-success-title {
  font-size: 20px;
  font-weight: 700;
  justify-content: center;
}
.ob-success-body {
  font-size: 14px;
  color: #4b5563;
}
.ob-ref-box {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ob-ref-label {
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.ob-ref-value {
  font-size: 20px;
  font-weight: 700;
  color: #c61d1e;
  letter-spacing: 2px;
}
.ob-success-hint {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

.mt-3 {
  margin-top: 12px;
}
.mt-6 {
  margin-top: 24px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mr-1 {
  margin-right: 4px;
}
.ml-auto {
  margin-left: auto;
}
.v-btn {
  text-transform: none;
}
.ob-notice-text {
  display: flex;
  flex-direction: column;
  gap: 6px; /* controls spacing between the two lines */
}

.ob-notice-sub {
  color: #1e40af;
  font-size: 13px;
}
</style>
