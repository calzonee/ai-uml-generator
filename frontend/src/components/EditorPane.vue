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
    console.log('Texteditor leer');
    return;
  }

  console.log('🛠️ Starte Diagramm-Rendering für Format:', selectedFormat.value);

  try {
    let imageSrc = '';

    if (selectedFormat.value === 'svg') {
      const res = await axios.post(
        '/api/uml',
        { plantuml: umlText, download: false },
        { responseType: 'text' }
      );
      imageSrc = encodeSvgToBase64(res.data);

    } else {
      const res = await axios.post(
        '/api/uml',
        { plantuml: umlText, download: true, format:selectedFormat.value },
        { responseType: 'blob' }
      );
      const blob = new Blob([res.data], { type: 'image/png' });
      imageSrc = URL.createObjectURL(blob);
    }

    // Diagramm-URL setzen und Event feuern
    renderedDiagramUrl.value = imageSrc;
    emit('diagramRendered', imageSrc);

  } catch (err) {
    console.error('Fehler beim UML Rendern:', err);
  }
}

watch(isStreaming, (streaming, old) => {
  if (old === true && streaming === false) {
    renderDiagram(responseText.value)
  }
})
const DEBOUNCE_MS = 800    
let debounceId

watch(
  responseText,
  (val, old) => {
    if (isStreaming.value) return
    if (val.trim() === (old ?? '').trim()) return

    clearTimeout(debounceId)
    debounceId = setTimeout(() => {
      renderDiagram(val.trim())
    }, DEBOUNCE_MS)
  },
  { flush: 'post' }
)
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
