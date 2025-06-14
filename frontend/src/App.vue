<template>
  <main class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">PlantUML Generator</h1>

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

    <!-- PlantUML-Editor -->
    <PlantUmlEditor
      v-if="plantumlCode"
      v-model:plantumlCode="plantumlCode"
      class="mt-6"
    />

    <!-- Diagramm-Anzeige -->
    <div v-if="diagramUrl" class="mt-6">
      <!-- SVG inline als Blob-URL -->
      <img :src="diagramUrl" alt="UML Diagramm" />
      <div class="mt-2">
        <label for="download-format">Download-Format:</label>
        <select id="download-format" v-model="downloadFormat" class="ml-2">
          <option value="png">PNG</option>
          <option value="svg">SVG</option>
        </select>
        <button
          class="px-3 py-1 ml-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          @click="downloadDiagram"
        >
          Herunterladen
        </button>
      </div>
    </div>

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

const prompt = ref('')
const selectedLLM = ref('openai')
const plantumlCode = ref('')
const diagramUrl = ref(null)
const downloadFormat = ref('png')
const loading = ref(false)
const error = ref(null)

// Backend-Client
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
    // 1) Generiere PlantUML-Text
    const resp1 = await api.post('/api/prompt', {
      prompt: prompt.value,
      model: selectedLLM.value,
      temperature: 0.7
    })
    if (!resp1.data.success) {
      throw new Error(resp1.data.error || 'Fehler bei der Generierung')
    }
    plantumlCode.value = resp1.data.plantuml

    // 2) Hole gerendertes Diagramm als SVG (Inline)
    const resp2 = await api.post('/api/uml', {
      plantuml: plantumlCode.value,
      download: false
    }, { responseType: 'text' })
    // Erstelle Blob-URL aus SVG-Text
    const svgText = resp2.data
    const blob = new Blob([svgText], { type: 'image/svg+xml' })
    diagramUrl.value = URL.createObjectURL(blob)
  } catch (err) {
    error.value = err.response?.data?.error || err.message
  } finally {
    loading.value = false
  }
}

function downloadDiagram() {
  if (!plantumlCode.value) return
  // Für Download: neuen Request mit download=true
  api.post('/api/uml', {
    plantuml: plantumlCode.value,
    download: true,
    format: downloadFormat.value
  }, { responseType: 'blob' }).then(res => {
    const blob = new Blob([res.data], { type: res.headers['content-type'] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagram.${downloadFormat.value}`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }).catch(err => {
    error.value = err.response?.data?.error || err.message
  })
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
