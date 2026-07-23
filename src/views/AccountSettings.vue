<!-- AccountSettings.vue -->
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import MainLayout from '@/components/Layouts/MainLayout.vue'

// ── Shared snackbar ────────────────────────────────────────────────────────
const snack = reactive({ show: false, message: '', color: 'success' })
const showSnack = (message, color = 'success') => {
  snack.message = message
  snack.color = color
  snack.show = true
}

// ── Current user context ────────────────────────────────────────────────────
const currentUserId = ref(null)
const currentUserRole = ref(null)
const currentUserEmail = ref(null)
const currentUserClientId = ref(null)
const pageLoading = ref(true)

const canManageTeam = computed(() => currentUserRole.value === 'client_admin')

async function loadCurrentUser() {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return

  currentUserId.value = user.id
  currentUserEmail.value = user.email

  const { data: me } = await supabase
    .from('profiles')
    .select('role, client_id')
    .eq('id', user.id)
    .single()

  currentUserRole.value = me?.role
  currentUserClientId.value = me?.client_id
}

// ── SECTION 1: Change password (logged in, knows current password) ────────
const changePwDialog = ref(false)
const changePwForm = ref(null)
const changePwSaving = ref(false)
const changePwDraft = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const pwRules = {
  required: (v) => !!v || 'Required',
  minLen: (v) => (v && v.length >= 8) || 'At least 8 characters',
  match: (v) => v === changePwDraft.new_password || 'Passwords do not match'
}

function openChangePassword() {
  changePwDraft.current_password = ''
  changePwDraft.new_password = ''
  changePwDraft.confirm_password = ''
  changePwDialog.value = true
}

async function submitChangePassword() {
  const { valid } = await changePwForm.value.validate()
  if (!valid) return

  changePwSaving.value = true
  try {
    // Re-authenticate with the current password before rotating it —
    // Supabase's updateUser() does not itself verify the old password.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: currentUserEmail.value,
      password: changePwDraft.current_password
    })
    if (reauthError) throw new Error('Current password is incorrect')

    const { error: updateError } = await supabase.auth.updateUser({
      password: changePwDraft.new_password
    })
    if (updateError) throw updateError

    changePwDialog.value = false
    showSnack('Password updated successfully')
  } catch (err) {
    showSnack(err.message, 'error')
  } finally {
    changePwSaving.value = false
  }
}

// ── SECTION 1b: Send reset link to my own email ─────────────────────────────
const sendingResetLink = ref(false)

async function sendResetLinkToSelf() {
  sendingResetLink.value = true
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(currentUserEmail.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    showSnack(`Reset link sent to ${currentUserEmail.value}`)
  } catch (err) {
    showSnack(err.message, 'error')
  } finally {
    sendingResetLink.value = false
  }
}

// ── SECTION 2: Team management ───────────────────────────────────────────────
const members = ref([])
const membersLoading = ref(true)

async function fetchMembers() {
  membersLoading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, is_active, last_login_at, mfa_enabled, created_at')
    .eq('client_id', currentUserClientId.value)
    .order('created_at')

  if (!error) members.value = data
  membersLoading.value = false
}

const initials = (name) =>
  (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const roleLabel = (role) => (role === 'client_admin' ? 'Admin' : 'Contributor')

async function callEdgeFunction(fnName, body) {
  const {
    data: { session }
  } = await supabase.auth.getSession()
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${fnName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`
    },
    body: JSON.stringify(body)
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Request failed')
  return json
}

// ── Invite dialog ─────────────────────────────────────────────────────────
const inviteDialog = ref(false)
const inviteForm = ref(null)
const inviting = ref(false)
const inviteDraft = reactive({ email: '', full_name: '', role: 'client_contributor' })

function openInviteDialog() {
  inviteDraft.email = ''
  inviteDraft.full_name = ''
  inviteDraft.role = 'client_contributor'
  inviteDialog.value = true
}

async function submitInvite() {
  const { valid } = await inviteForm.value.validate()
  if (!valid) return

  inviting.value = true
  try {
    await callEdgeFunction('invite-team-member', { ...inviteDraft })
    inviteDialog.value = false
    showSnack(`Invitation sent to ${inviteDraft.email}`)
    await fetchMembers()
  } catch (err) {
    showSnack(err.message, 'error')
  } finally {
    inviting.value = false
  }
}

// ── Edit member dialog (role + active toggle in one place) ─────────────────
const editMemberDialog = ref(false)
const editMemberSaving = ref(false)
const editMemberDraft = reactive({ id: null, full_name: '', email: '', role: '', is_active: true })

function openEditMember(member) {
  Object.assign(editMemberDraft, member)
  editMemberDialog.value = true
}

async function submitEditMember() {
  if (editMemberDraft.id === currentUserId.value && !editMemberDraft.is_active) {
    showSnack('You cannot deactivate your own account', 'error')
    return
  }

  editMemberSaving.value = true
  try {
    await callEdgeFunction('update-team-member', {
      target_user_id: editMemberDraft.id,
      role: editMemberDraft.role,
      is_active: editMemberDraft.is_active
    })
    editMemberDialog.value = false
    showSnack('Team member updated')
    await fetchMembers()
  } catch (err) {
    showSnack(err.message, 'error')
  } finally {
    editMemberSaving.value = false
  }
}

// ── Quick deactivate/reactivate from the row (no dialog needed) ────────────
const togglingId = ref(null)

async function quickToggleActive(member) {
  if (member.id === currentUserId.value) {
    showSnack('You cannot deactivate your own account', 'error')
    return
  }
  togglingId.value = member.id
  try {
    await callEdgeFunction('update-team-member', {
      target_user_id: member.id,
      is_active: !member.is_active
    })
    showSnack(member.is_active ? 'Member deactivated' : 'Member reactivated')
    await fetchMembers()
  } catch (err) {
    showSnack(err.message, 'error')
  } finally {
    togglingId.value = null
  }
}

// ── Init ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadCurrentUser()
  await fetchMembers()
  pageLoading.value = false
})
</script>

<template>
  <main-layout>
    <div class="mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-slate-900">Account Settings</h1>
        <p class="text-sm text-slate-500 mt-1">
          Manage your security and your organisation's team access.
        </p>
      </div>

      <div v-if="pageLoading" class="flex items-center justify-center py-24 text-slate-400 gap-2">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        Loading account settings…
      </div>

      <template v-else>
        <!-- ══════════════════ SECURITY SECTION ══════════════════ -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-lock text-blue-600"></i>
              Security
            </span>
          </div>

          <div class="p-5 flex flex-col gap-3">
            <div
              class="flex items-center justify-between gap-4 rounded-xl bg-slate-50 border border-slate-100 p-4"
            >
              <div class="flex items-start gap-3 min-w-0">
                <div
                  class="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"
                >
                  <i class="fa-solid fa-key text-sm"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-slate-900">Password</div>
                  <div class="text-xs text-slate-500 mt-0.5">
                    Signed in as
                    <span class="font-medium text-slate-700">{{ currentUserEmail }}</span>
                  </div>
                </div>
              </div>
              <button
                @click="openChangePassword"
                class="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 flex-shrink-0 transition"
              >
                Change Password
              </button>
            </div>

            <div
              class="flex items-center justify-between gap-4 rounded-xl bg-slate-50 border border-slate-100 p-4"
            >
              <div class="flex items-start gap-3 min-w-0">
                <div
                  class="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0"
                >
                  <i class="fa-solid fa-envelope-open-text text-sm"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-slate-900">
                    Forgot your current password?
                  </div>
                  <div class="text-xs text-slate-500 mt-0.5">
                    We'll email you a secure link to set a new one.
                  </div>
                </div>
              </div>
              <button
                @click="sendResetLinkToSelf"
                :disabled="sendingResetLink"
                class="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 flex-shrink-0 transition disabled:opacity-50"
              >
                <i v-if="sendingResetLink" class="fa-solid fa-circle-notch fa-spin mr-1"></i>
                Send Reset Link
              </button>
            </div>
          </div>
        </div>

        <!-- ══════════════════ TEAM MANAGEMENT SECTION ══════════════════ -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-users-gear text-blue-600"></i>
              Team Management
            </span>
            <button
              v-if="canManageTeam"
              @click="openInviteDialog"
              class="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-2 flex items-center gap-1.5 transition"
            >
              <i class="fa-solid fa-user-plus"></i> Invite Member
            </button>
          </div>

          <div v-if="!canManageTeam" class="px-5 pt-4 pb-1">
            <div
              class="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
            >
              <i class="fa-solid fa-circle-info"></i>
              Only Admins can invite or manage team members. You have read-only access to this list.
            </div>
          </div>

          <div v-if="membersLoading" class="px-5 py-10 text-center text-slate-400 text-sm">
            <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading team…
          </div>

          <div v-else class="p-5 flex flex-col gap-2">
            <div
              v-for="m in members"
              :key="m.id"
              class="flex items-center justify-between gap-3 rounded-xl border p-3 transition"
              :class="
                m.is_active
                  ? 'bg-slate-50 border-slate-100'
                  : 'bg-slate-100 border-slate-200 opacity-70'
              "
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                >
                  {{ initials(m.full_name) }}
                </div>
                <div class="min-w-0">
                  <div
                    class="text-sm font-semibold text-slate-900 truncate flex items-center gap-1.5"
                  >
                    {{ m.full_name }}
                    <span
                      v-if="m.id === currentUserId"
                      class="text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-full px-1.5 py-0.5"
                      >You</span
                    >
                  </div>
                  <div class="text-xs text-slate-400 truncate">{{ m.email }}</div>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <span v-if="m.mfa_enabled" class="text-slate-400" title="MFA enabled">
                  <i class="fa-solid fa-shield-halved text-xs"></i>
                </span>

                <span
                  class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  :class="
                    m.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
                  "
                  >{{ m.is_active ? 'Active' : 'Disabled' }}</span
                >

                <span
                  class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  :class="
                    m.role === 'client_admin'
                      ? 'bg-violet-50 text-violet-600'
                      : 'bg-sky-50 text-sky-600'
                  "
                  >{{ roleLabel(m.role) }}</span
                >

                <template v-if="canManageTeam">
                  <button
                    @click="openEditMember(m)"
                    class="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                  >
                    <i class="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button
                    v-if="m.id !== currentUserId"
                    @click="quickToggleActive(m)"
                    :disabled="togglingId === m.id"
                    class="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-40"
                  >
                    <i
                      class="fa-solid text-xs"
                      :class="
                        togglingId === m.id
                          ? 'fa-circle-notch fa-spin'
                          : m.is_active
                            ? 'fa-user-slash'
                            : 'fa-user-check'
                      "
                    ></i>
                  </button>
                </template>
              </div>
            </div>

            <div v-if="members.length === 0" class="text-center text-sm text-slate-400 py-8">
              No team members found.
            </div>
          </div>
        </div>
      </template>

      <!-- ══════════════════ DIALOG: Change Password ══════════════════ -->
      <v-dialog v-model="changePwDialog" max-width="420">
        <v-card>
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <v-form ref="changePwForm" @submit.prevent>
              <v-text-field
                v-model="changePwDraft.current_password"
                label="Current Password"
                type="password"
                :rules="[pwRules.required]"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
              <v-text-field
                v-model="changePwDraft.new_password"
                label="New Password"
                type="password"
                :rules="[pwRules.required, pwRules.minLen]"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
              <v-text-field
                v-model="changePwDraft.confirm_password"
                label="Confirm New Password"
                type="password"
                :rules="[pwRules.required, pwRules.match]"
                variant="outlined"
                density="comfortable"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="changePwDialog = false">Cancel</v-btn>
            <v-btn
              color="#2563eb"
              variant="flat"
              :loading="changePwSaving"
              @click="submitChangePassword"
            >
              Update Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ══════════════════ DIALOG: Invite Member ══════════════════ -->
      <v-dialog v-model="inviteDialog" max-width="420">
        <v-card>
          <v-card-title>Invite Team Member</v-card-title>
          <v-card-text>
            <v-form ref="inviteForm" @submit.prevent>
              <v-text-field
                v-model="inviteDraft.email"
                label="Email"
                type="email"
                :rules="[(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'Invalid email']"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
              <v-text-field
                v-model="inviteDraft.full_name"
                label="Full Name"
                :rules="[(v) => !!v || 'Required']"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
              <v-select
                v-model="inviteDraft.role"
                :items="[
                  { title: 'Admin — can manage team', value: 'client_admin' },
                  { title: 'Contributor', value: 'client_contributor' }
                ]"
                item-title="title"
                item-value="value"
                label="Role"
                variant="outlined"
                density="comfortable"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="inviteDialog = false">Cancel</v-btn>
            <v-btn color="#2563eb" variant="flat" :loading="inviting" @click="submitInvite">
              Send Invite
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ══════════════════ DIALOG: Edit Member ══════════════════ -->
      <v-dialog v-model="editMemberDialog" max-width="420">
        <v-card>
          <v-card-title>Edit Team Member</v-card-title>
          <v-card-text>
            <div class="text-sm font-semibold text-slate-900 mb-1">
              {{ editMemberDraft.full_name }}
            </div>
            <div class="text-xs text-slate-400 mb-4">{{ editMemberDraft.email }}</div>

            <v-select
              v-model="editMemberDraft.role"
              :items="[
                { title: 'Admin — can manage team', value: 'client_admin' },
                { title: 'Contributor', value: 'client_contributor' }
              ]"
              item-title="title"
              item-value="value"
              label="Role"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />

            <div
              class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
            >
              <span class="text-sm text-slate-700">Account Active</span>
              <v-switch
                v-model="editMemberDraft.is_active"
                :disabled="editMemberDraft.id === currentUserId"
                color="#2563eb"
                hide-details
                inset
              />
            </div>
            <div v-if="editMemberDraft.id === currentUserId" class="text-xs text-amber-600 mt-2">
              You cannot deactivate your own account.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="editMemberDialog = false">Cancel</v-btn>
            <v-btn
              color="#2563eb"
              variant="flat"
              :loading="editMemberSaving"
              @click="submitEditMember"
            >
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snack.show" :color="snack.color" :timeout="4000" location="bottom right">
        {{ snack.message }}
        <template #actions>
          <v-btn variant="text" @click="snack.show = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </main-layout>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>
