<!-- EditorPane.vue ist für die Frontend LLM Logik zuständig. Verwaltet zentral
  Werte aus EditorToolbar.vue, sendet sie PromptInput.vue und implementiert 
  Logik nach senden des Prompts (Stream Logik) -->
<script setup>
import { ref, provide, defineProps, watch, defineEmits } from 'vue'
import axios from 'axios'

import TextEditor from './TextEditor.vue'
import PromptInput from './PromptInput.vue'
import EditorToolbar from './EditorToolbar.vue'

// Props
const props = defineProps({
  width: Number,
})

// Toolbar-Status
const selectedModel = ref('llama3b')
provide('selectedModel', selectedModel)
const selectedDiagram = ref('none')
provide('selectedDiagram', selectedDiagram)
const darkMode = ref(false)
provide('darkMode', darkMode)

// Streaming-Zustände
const isStreaming = ref(false)
provide('isStreaming', isStreaming)
const responseText = ref('')
provide('responseText', responseText)

// Emits
const emit = defineEmits(['diagramRendered'])
// UML Rendering
const renderedDiagramUrl = ref('')
provide('renderedDiagramUrl', renderedDiagramUrl)
const selectedFormat = ref('png')
provide('selectedFormat', selectedFormat)

// Hilfsfunktion
function encodeSvgToBase64(svgString) {
  const encoder = new TextEncoder()
  const svgBytes = encoder.encode(svgString)
  const binary = Array.from(svgBytes)
    .map((b) => String.fromCharCode(b))
    .join('')
  const base64 = btoa(binary)
  return `data:image/svg+xml;base64,${base64}`
}

// Diagramm rendern
async function renderDiagram(umlText) {
  if (!umlText.trim()) {
    console.log('Texteditor leer')
    return
  }

  console.log('🛠️ Starte Diagramm-Rendering für Format:', selectedFormat.value) // Rendering startet

  try {
    const format = selectedFormat.value

    const res = await axios.post(
      '/api/uml',
      {
        plantuml: umlText,
        format,
        download: false,
      },
      {
        responseType: format === 'svg' ? 'text' : 'blob',
      },
    )

    console.log('✅ Serverantwort erhalten') // Axios erfolgreich

    let imageSrc = ''

    if (format === 'svg') {
      imageSrc = encodeSvgToBase64(res.data)
      console.log('🎨 SVG erfolgreich kodiert') // SVG erfolgreich
    } else if (format === 'png') {
      const blob = new Blob([res.data], { type: 'image/png' })
      imageSrc = URL.createObjectURL(blob)
      console.log('🖼️ PNG-Blob-URL erstellt') // PNG erfolgreich
    }

    renderedDiagramUrl.value = imageSrc
    console.log('📡 Diagramm-URL gesetzt:', imageSrc) // URL gespeichert
    emit('diagramRendered', imageSrc) // an ChatUmlView weitergeben
  } catch (err) {
    console.error('Fehler beim UML Rendern:', err)
  }
}

// Nach Stream-Ende rendern
watch(responseText, (newText) => {
  if (!isStreaming.value) {
    console.log('📥 Stream beendet – versuche zu rendern') // Stream-Ende Trigger
    renderDiagram(newText)
  }
})

// Wenn Text im Editor geändert wird
let debounceTimeout = null

watch(responseText, (newText, oldText) => {
  if (isStreaming.value) return

  const trimmedNew = newText.trim()
  const trimmedOld = oldText?.trim()

  if (trimmedNew !== trimmedOld) {
    console.log('✏️ Editor-Text geändert – debounce gesetzt') // Editor-Änderung
    if (debounceTimeout) clearTimeout(debounceTimeout)
    console.log('⏱️ Vorheriges debounce abgebrochen') // Vorherige Verzögerung gestoppt

    debounceTimeout = setTimeout(() => {
      console.log('⏳ Debounce-Zeit erreicht – rendere Diagramm') // Verzögerung vorbei
      renderDiagram(trimmedNew)
    }, 1000)
  }
})
</script>

<template>
  <div
    :style="{ width: width + 'px' }"
    class="editor-pane flex h-full flex-col overflow-hidden"
  >
    <EditorToolbar />
    <TextEditor class="flex-1" />
    <PromptInput class="mt-2 border-t bg-gray-100 p-2" />
  </div>
</template>

<style scoped>
.editor-pane {
  background: #1e1e1e;
}
</style>
