<!-- EditorPane.vue ist für die Frontend LLM Logik zuständig. Verwaltet zentral
  Werte aus EditorToolbar.vue, sendet sie PromptInput.vue und implementiert 
  Logik nach senden des Prompts (Stream Logik) -->
<script setup>
import { ref, provide, defineProps } from 'vue'
import TextEditor from './TextEditor.vue'
import PromptInput from './PromptInput.vue'
import EditorToolbar from './EditorToolbar.vue'

// Props
const props = defineProps({
  width: Number,
})

// Toolbar-Status
const selectedModel = ref('llama3b')
const selectedDiagram = ref('none')
const darkMode = ref(false)

// Streaming-Zustände
const isStreaming = ref(false)
const responseText = ref('')

// Bereitstellen
provide('selectedModel', selectedModel)
provide('selectedDiagram', selectedDiagram)
provide('darkMode', darkMode)
provide('isStreaming', isStreaming)
provide('responseText', responseText)
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
