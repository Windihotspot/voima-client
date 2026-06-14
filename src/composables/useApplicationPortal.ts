// composables/useApplicantPortal.ts
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export interface OnboardingDocument {
  id: string
  doc_type: string
  file_name: string
  file_path: string | null
  mime_type: string | null
  file_size: number | null
  is_confirmed: boolean
  uploaded_at: string
}

export interface OnboardingDirector {
  id: string
  full_name: string
  job_title: string | null
  nationality: string | null
  date_of_birth: string | null
  id_type: string | null
  id_number: string | null
  email: string | null
  is_ubo: boolean
  ownership_percent: number | null
}

export interface OnboardingApplication {
  id: string
  company_name: string
  trading_name: string | null
  organisation_type: string
  registration_number: string | null
  registration_country: string
  date_of_incorporation: string | null
  website: string | null
  industry_description: string | null
  is_regulated: boolean
  regulator_name: string | null
  regulatory_license_number: string | null
  license_expiry_date: string | null
  contact_full_name: string
  contact_job_title: string | null
  contact_email: string
  contact_phone: string
  registered_address: string | null
  operating_address: string | null
  city: string | null
  country: string
  service_package: string | null
  service_interest: string[] | null
  description_of_needs: string | null
  has_existing_compliance_program: boolean
  existing_compliance_notes: string | null
  estimated_monthly_transactions: string | null
  customer_base_description: string | null
  status: string
  reference_number: string | null
  submitted_at: string | null
  created_at: string
  updated_at: string
}

export function useApplicantPortal() {
  const application = ref<OnboardingApplication | null>(null)
  const documents = ref<OnboardingDocument[]>([])
  const directors = ref<OnboardingDirector[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMyApplication() {
    loading.value = true
    error.value = null

    try {
      const { data, error: rpcError } = await supabase.rpc('get_my_onboarding_application')
      console.log('application data:', data)

      if (rpcError) throw rpcError

      application.value = data.application
      documents.value = data.documents
      directors.value = data.directors
    } catch (err: any) {
      error.value = err.message || 'Failed to load your application.'
    } finally {
      loading.value = false
    }
  }

  async function getDocumentDownloadUrl(filePath: string) {
    const { data, error: urlError } = await supabase.storage
      .from('onboarding-documents')
      .createSignedUrl(filePath, 60 * 5) // 5 minutes

    if (urlError) throw urlError
    return data.signedUrl
  }

  return {
    application,
    documents,
    directors,
    loading,
    error,
    fetchMyApplication,
    getDocumentDownloadUrl
  }
}
