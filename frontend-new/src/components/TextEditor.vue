<script setup>
import { onMounted, ref, watch, inject } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'

const editorRef = ref(null)
const view = ref(null)
const responseText = inject('responseText')

onMounted(async () => {
  // Initialisiere EditorView
  view.value = new EditorView({
    parent: editorRef.value,
    doc: '',
    extensions: [basicSetup, oneDark],
  })

  // Fake-Streaming-Daten simulieren
  const fakeData = [
    '@startuml\n',
    'Alice -> Bob: Hello\n',
    'Bob --> Alice: Hi!\n',
    '@enduml\n',
  ]

  for (let part of fakeData) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    responseText.value += part
  }
})

// Dynamisch Inhalt setzen, wenn sich der Stream aktualisiert
watch(responseText, (newText) => {
  if (view.value) {
    view.value.dispatch({
      changes: { from: 0, to: view.value.state.doc.length, insert: newText },
    })
  }
})
</script>

<template>
  <div ref="editorRef" class="editor" />
</template>

<style scoped>
.editor {
  height: 100%;
  min-height: 100px;
}

:deep(.cm-scroller) {
  max-height: 70vh;
}

/* :deep(.cm-editor) {
  border-radius: 1rem;
} */
</style>
