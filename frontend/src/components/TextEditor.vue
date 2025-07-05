<script setup>
import { onMounted, ref, watch, inject,nextTick } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'

const editorRef = ref(null)
const view = ref(null)
const responseText = inject('responseText')
const isStreaming = inject('isStreaming') // <-- Flag, ob gerade Stream läuft

// Flag, um Zyklen zu verhindern
let updatingFromStream = false

onMounted(async () => {
  // Editor initialisieren
  view.value = new EditorView({
    parent: editorRef.value,
    doc: '',
    extensions: [
      basicSetup,
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !updatingFromStream) {
          responseText.value = update.state.doc.toString()
        }
      }),
    ],
  })

  const fakeData = [
    '@startuml\n',
    'Alice -> Bob: Hello\n',
    'Bob --> Alice: Hi!\n',
    '@enduml',
  ]

  isStreaming.value = true

  for (const part of fakeData) {
    await new Promise(r => setTimeout(r, 500))
    responseText.value += part 
  }
  await nextTick()
  isStreaming.value = false
})

watch(responseText, (newText) => {
  if (!view.value) return
  if (!isStreaming.value) return 

  updatingFromStream = true
  view.value.dispatch({
    changes: { from: 0, to: view.value.state.doc.length, insert: newText },
  })
  updatingFromStream = false
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
</style>
