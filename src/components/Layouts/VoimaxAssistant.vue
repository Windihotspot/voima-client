<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { supabase } from '@/services/supabase'

const props = defineProps({
  context: { type: Object, default: () => ({}) }
})

const isOpen = ref(false)
const sending = ref(false)
const inputText = ref('')
const messagesEl = ref(null)
const messages = ref([]) // { role: 'user'|'assistant', content: string }

const quickPrompts = [
  { label: 'Explain this question', text: 'Can you explain what this question is really asking?' },
  {
    label: 'Why does this matter?',
    text: 'Why is this question important for a company like mine?'
  },
  {
    label: 'What evidence do I need?',
    text: 'What evidence would I need to support a "Yes" answer here?'
  },
  { label: 'What if I answer No?', text: 'What happens if I answer "No" to this question?' }
]

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

async function sendMessage(text) {
  const content = (text || inputText.value).trim()
  if (!content || sending.value) return

  messages.value.push({ role: 'user', content })
  inputText.value = ''
  sending.value = true
  scrollToBottom()

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voimax-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        message: content,
        context: props.context,
        // send the last few turns only, keeps the request small
        history: messages.value.slice(-8, -1)
      })
    })

    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Something went wrong')

    messages.value.push({ role: 'assistant', content: json.reply })
  } catch (err) {
    messages.value.push({
      role: 'assistant',
      content: `Sorry, I ran into an issue: ${err.message}`
    })
  } finally {
    sending.value = false
    scrollToBottom()
  }
}

function toggleOpen() {
  isOpen.value = !isOpen.value
  if (isOpen.value) scrollToBottom()
}

// Clear the visible thread when the active question changes, so advice
// doesn't bleed across unrelated questions — but keep the panel open
// state so it doesn't feel like it "closed" on them.
watch(
  () => props.context?.question_ref,
  () => {
    messages.value = []
  }
)
</script>

<template>
  <!-- Floating trigger button -->
  <button
    v-if="!isOpen"
    @click="toggleOpen"
    class="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full pl-4 pr-5 py-3 shadow-lg transition"
  >
    <i class="fa-solid fa-sparkles text-sm"></i>
    <span class="text-sm font-semibold">Ask VoimaX</span>
  </button>

  <!-- Chat panel -->
  <div
    v-if="isOpen"
    class="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-blue-600 text-white flex-shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
        >
          <i class="fa-solid fa-sparkles text-xs"></i>
        </div>
        <div class="min-w-0">
          <div class="text-sm font-bold leading-tight">VoimaX Assistant</div>
          <div class="text-[11px] text-blue-100 truncate leading-tight">
            {{ context?.question_ref ? `On ${context.question_ref}` : 'Compliance guidance' }}
          </div>
        </div>
      </div>
      <button
        @click="toggleOpen"
        class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition"
      >
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>
    </div>

    <!-- Messages -->
    <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
      <div v-if="messages.length === 0" class="text-center py-6">
        <div
          class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3"
        >
          <i class="fa-solid fa-sparkles"></i>
        </div>
        <div class="text-sm font-semibold text-slate-900 mb-1">Stuck on this question?</div>
        <div class="text-xs text-slate-500 mb-4 px-4">
          Ask me anything about {{ context?.question_ref || 'this assessment' }} — I'll help you
          figure out the right answer.
        </div>
        <div class="flex flex-col gap-2 px-2">
          <button
            v-for="qp in quickPrompts"
            :key="qp.label"
            @click="sendMessage(qp.text)"
            class="text-xs text-left font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg px-3 py-2 transition"
          >
            {{ qp.label }}
          </button>
        </div>
      </div>

      <div
        v-for="(m, i) in messages"
        :key="i"
        class="flex"
        :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
          :class="
            m.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-slate-100 text-slate-800 rounded-bl-md'
          "
        >
          {{ m.content }}
        </div>
      </div>

      <div v-if="sending" class="flex justify-start">
        <div class="bg-slate-100 rounded-2xl rounded-bl-md px-3.5 py-2.5 flex items-center gap-1.5">
          <span
            class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
            style="animation-delay: 0ms"
          />
          <span
            class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          />
          <span
            class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          />
        </div>
      </div>
    </div>

    <!-- Quick prompts (shown once there's history, as smaller chips) -->
    <div v-if="messages.length > 0" class="px-3 pt-2 flex gap-1.5 overflow-x-auto flex-shrink-0">
      <button
        v-for="qp in quickPrompts"
        :key="qp.label"
        @click="sendMessage(qp.text)"
        class="text-[11px] whitespace-nowrap font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-full px-2.5 py-1 transition flex-shrink-0"
      >
        {{ qp.label }}
      </button>
    </div>

    <!-- Input -->
    <div class="p-3 border-t border-slate-100 flex-shrink-0">
      <div class="flex items-end gap-2">
        <textarea
          v-model="inputText"
          rows="1"
          placeholder="Ask VoimaX…"
          class="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 max-h-24"
          @keydown.enter.exact.prevent="sendMessage()"
        />
        <button
          @click="sendMessage()"
          :disabled="sending || !inputText.trim()"
          class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition"
        >
          <i class="fa-solid fa-paper-plane text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>
