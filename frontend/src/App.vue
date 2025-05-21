<script setup>
import PromptInput from "./components/PromptInput.vue";
import DiagramPreview from "./components/DiagramPreview.vue";
import TextEditor from "./components/TextEditor.vue";
</script>

<template>
  <h1 class="title">ChatUML</h1>
  <div class="app">
    <div class="edit">
      <TextEditor />
      <PromptInput />
    </div>
    <DiagramPreview class="preview"/>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}
.app {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
}

/* Der Editorbereich links */
.edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid grey;
  border-radius: 1rem 1rem 0 0;
}

/* Diagramm rechts */
.preview {
}

/* Responsive Umschaltung */
@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }

  .preview {
    flex: none;
    width: 100%;
  }
}
</style>
