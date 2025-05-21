<template>
  <main class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4"></h1>

    <!-- Auswahl des LLM -->
    <LLMSelector v-model:selectedLLM="selectedLLM" class="mb-4" />

    <!-- Prompt-Eingabe -->
    <PromptInput v-model:prompt="prompt" class="mb-4" />

    <!-- Generieren-Button -->
    <button
      class="px-4 py-2 rounded shadow hover:bg-gray-100 disabled:opacity-50"
      :disabled="loading"
      @click="generatePlantUML"
    >
      Generieren
    </button>

    <!-- Spinner -->
    <div v-if="loading" class="spinner mt-4"></div>

    <!-- Fehlermeldung -->
    <div v-if="error" class="error mt-4">{{ error }}</div>

    <!-- PlantUML-Editor (immer anzeigen, wenn Code vorhanden) -->
    <PlantUmlEditor
      v-if="plantumlCode"
      v-model:plantumlCode="plantumlCode"
      class="mt-6"
    />

    <!-- Diagramm-Anzeige -->
    <DiagramDisplay
      v-if="diagramUrl"
      :diagramUrl="diagramUrl"
      @download="downloadDiagram"
      class="mt-6"
    />

    <!-- Hinweis bei PlantUML-Fehler -->
    <div
      v-else-if="!loading && !error && plantumlCode"
      class="text-sm text-gray-600 mt-4"
    >
      Kein Bild – PlantUML-Fehler?
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import PromptInput from './components/PromptInput.vue'
import LLMSelector from './components/LLMSelector.vue'
import PlantUmlEditor from './components/PlantUmlEditor.vue'
import DiagramDisplay from './components/DiagramDisplay.vue'

const prompt = ref('')
const selectedLLM = ref('openai')
const plantumlCode = ref('')
const diagramUrl = ref(null)
const loading = ref(false)
const error = ref(null)

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })

async function generatePlantUML() {
  if (!prompt.value.trim()) {
    alert('Bitte einen Prompt eingeben.')
    return
  }

  loading.value = true
  error.value = null
  diagramUrl.value = null

  try {
    const { data } = await api.post('/api/generate', {
      prompt: prompt.value,
      llm: selectedLLM.value
    })

    plantumlCode.value = data.plantuml

    if (data.success) {
      diagramUrl.value = `data:image/png;base64,${data.imageBase64}`
    } else {
      error.value = data.error
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message
  } finally {
    loading.value = false
  }
}

function downloadDiagram() {
  if (!diagramUrl.value) return
  const link = document.createElement('a')
  link.href = diagramUrl.value
  link.download = 'uml_diagram.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style>
.spinner {
  margin: 1em auto;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error {
  color: #b91c1c;
}
</style>
