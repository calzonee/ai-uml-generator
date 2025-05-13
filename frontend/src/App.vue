<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import PromptInput from './components/PromptInput.vue'
import LLMSelector from './components/LLMSelector.vue'
import PlantUmlEditor from './components/PlantUmlEditor.vue'
import DiagramDisplay from './components/DiagramDisplay.vue'

const state = reactive({
  prompt: '',
  selectedLLM: 'openai',
  plantumlCode: '',
  diagramUrl: null,
  loading: false,
  error: null,
})

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})
const generatePlantUML = async () => {
  if (!state.prompt) {
    alert('Bitte einen Prompt eingeben.')
    return
  }
  state.loading = true
  state.error = null
  try {
    const { data } = await api.post('/api/generate', {
      prompt: state.prompt,
      llm: state.selectedLLM,      // falls Backend mehrere LLMs unterstützen soll
    })
    // Backend liefert jetzt { plantuml: string, imageBase64: string }
    state.plantumlCode = data.plantuml
    state.diagramUrl = `data:image/png;base64,${data.imageBase64}`
  } catch (err) {
    state.error = err.response?.data?.error || err.message
    state.diagramUrl = null
  } finally {
    state.loading = false
  }
}

const downloadDiagram = () => {
  if (!state.diagramUrl) return
  const link = document.createElement('a')
  link.href = state.diagramUrl
  link.download = 'uml_diagram.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <main>
    <h1>UML-Diagramm Generator</h1>

    <!-- Auswahl des LLM, falls ihr später mehrere betreibt -->
    <LLMSelector v-model:selectedLLM="state.selectedLLM" />

    <!-- Prompt-Eingabe -->
    <PromptInput v-model:prompt="state.prompt" />

    <!-- Auslösen -->
    <button :disabled="state.loading" @click="generatePlantUML">
      {{ state.loading ? 'Generiere …' : 'Generieren' }}
    </button>

    <!-- Fehlermeldung -->
    <div v-if="state.error" class="error">{{ state.error }}</div>

    <!-- PlantUML-Quelltext zum Nachbearbeiten -->
    <PlantUmlEditor v-model:plantumlCode="state.plantumlCode" />

    <!-- Gerendertes Diagramm & Download-Button -->
    <DiagramDisplay
      v-if="state.diagramUrl"
      :diagramUrl="state.diagramUrl"
      @download="downloadDiagram"
    />
  </main>
</template>

<style>
.error {
  color: red;
  margin-top: 1em;
}
</style>
