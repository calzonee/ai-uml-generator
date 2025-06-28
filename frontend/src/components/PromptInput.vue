<script setup>
import { ref, watch, nextTick, inject } from 'vue'

const prompt = ref('')
const textareaRef = ref(null)

const selectedModel = inject('selectedModel')
const selectedDiagram = inject('selectedDiagram')
const darkMode = inject('darkMode')

const isStreaming = inject('isStreaming')
const responseText = inject('responseText')

function adjustHeight() {
  if (!textareaRef.value) return
  textareaRef.value.style.height = 'auto'
  const maxHeight = (textareaRef.value.scrollHeight * 8) / textareaRef.value.rows
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, maxHeight)}px`
}

watch(prompt, () => {
  nextTick(adjustHeight)
})

async function sendPrompt() {
  if (prompt.value.trim() === '' || isStreaming.value) return

  responseText.value = ''
  isStreaming.value = true

  try {
    console.log('model', selectedModel.value)
    console.log('prompt', prompt.value)
    const response = await fetch('/api/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.value,
        model: selectedModel.value,
        diagram: selectedDiagram.value,
        darkMode: darkMode.value,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      responseText.value += decoder.decode(value, { stream: true })
    }
  } catch (err) {
    console.error('Fehler beim Streamen:', err)
  } finally {
    isStreaming.value = false
    prompt.value = ''
  }
}

// async function sendPrompt() {
//   if (prompt.value.trim() === '' || isStreaming.value) return

//   responseText.value = ''
//   isStreaming.value = true

//   try {
//     // Fake-Streaming-Daten
//     const fakeData = [
//       '@startuml\n',
//       'Alice -> Bob: Hello\n',
//       'Bob --> Alice: Hi!\n',
//       '@enduml\n',
//     ]

//     for (let part of fakeData) {
//       await new Promise((resolve) => setTimeout(resolve, 500)) // Delay simulieren
//       responseText.value += part
//     }
//   } catch (err) {
//     console.error('Fehler beim Fake-Stream:', err)
//   } finally {
//     isStreaming.value = false
//     prompt.value = ''
//   }
// }
</script>

<template>
  <div
    class="m-4 flex items-center gap-2 rounded bg-gray-700 p-2 shadow-md shadow-gray-950/50"
  >
    <textarea
      ref="textareaRef"
      v-model="prompt"
      @input="adjustHeight"
      :disabled="isStreaming"
      rows="1"
      placeholder="Schreibe deine Eingabe..."
      class="flex-grow resize-none rounded bg-gray-600 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      style="max-height: calc(1.5rem * 8)"
    ></textarea>

    <button
      @click="sendPrompt"
      :disabled="isStreaming"
      class="flex items-center justify-center rounded bg-gray-300 p-2 text-gray-800 transition-colors hover:bg-gray-400 active:bg-gray-500"
      type="button"
      aria-label="Senden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 -rotate-45"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</template>
