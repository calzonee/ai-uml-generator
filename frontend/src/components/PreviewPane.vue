<script setup>
import PreviewToolbar from './PreviewToolbar.vue'
</script>

<template>
  <div class="block">
    <PreviewToolbar />
    <div class="preview">
      <img src="../assets/usecase-ai-uml-generator.png" alt="" class="diagram" />
      <!-- <img src="../assets/sequenz-ai-uml-generator.png" alt="" class="diagram"> -->
    </div>
  </div>
</template>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.preview-buttons {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.diagram {
  max-height: 65vh;
  max-width: 48vw;
}
</style>
