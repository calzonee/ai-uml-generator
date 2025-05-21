<script setup>
import { onMounted, ref } from "vue";
import { EditorView, basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";

// import { plantUML, plantUMLHighlightStyle } from "../assets/plantuml-mode.js";

const editorRef = ref(null);

onMounted(() => {
  new EditorView({
    parent: editorRef.value,
    doc: `@startuml\nAlice -> Bob: Hello\n@enduml`,
    extensions: [
      basicSetup,
      oneDark,
      // plantUML,
      // plantUMLHighlightStyle
    ]
  });
});
</script>

<template>
  <div ref="editorRef" class="editor" />
</template>

<style scoped>
.editor {
  height: 100%;
  min-height: 300px;
}

:deep(.cm-scroller) {
  max-height: 56vh;
}

:deep(.cm-editor) {
  border-radius: 1rem;
}
</style>
