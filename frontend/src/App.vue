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

const generatePlantUML = async () => {
  if (!state.prompt) {
    alert('Bitte einen Prompt eingeben.')
    return
  }
  state.loading = true
  state.error = null
  try {
    const response = await axios.post('/api/generate', {
      prompt: state.prompt,
      llm: state.selectedLLM,
    })
    state.plantumlCode = response.data.plantumlCode
    await renderDiagram()
  } catch (err) {
    state.error = err.message
  } finally {
    state.loading = false
  }
}

const renderDiagram = async () => {
  if (!state.plantumlCode) {
    state.diagramUrl = null
    return
  }
  try {
    const response = await axios.post('/api/render', {
      plantumlCode: state.plantumlCode,
      format: 'png',
    }, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data)
    if (state.diagramUrl) {
      URL.revokeObjectURL(state.diagramUrl)
    }
    state.diagramUrl = url
  } catch (err) {
    state.error = 'Diagramm konnte nicht gerendert werden: ' + err.message
    state.diagramUrl = null
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
    <LLMSelector v-model:selectedLLM="state.selectedLLM" />
    <PromptInput v-model:prompt="state.prompt" />
    <button :disabled="state.loading" @click="generatePlantUML">
      {{ state.loading ? 'Generiere ...' : 'Generieren' }}
    </button>
    <div v-if="state.error" style="color: red; margin-top: 1em;">{{ state.error }}</div>

    <PlantUmlEditor v-model:plantumlCode="state.plantumlCode" @updateDiagram="renderDiagram" />
    <DiagramDisplay v-if="state.diagramUrl" :diagramUrl="state.diagramUrl" @download="downloadDiagram" />
  </main>
</template>