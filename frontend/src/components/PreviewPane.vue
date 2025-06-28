<script setup>
import { defineProps } from 'vue'

import PreviewToolbar from './PreviewToolbar.vue'

const props = defineProps({
  imageSrc: String,
})
// const renderedDiagramUrl = inject('renderedDiagramUrl')
</script>

<template>
  <div class="block">
    <PreviewToolbar @downloadClicked="handleDownload" />
    <div class="preview">
      <img :src="imageSrc" alt="Diagram Vorschau" class="diagram" v-if="imageSrc" />
      <!-- <img src="../assets/usecase-ai-uml-generator.png" alt="" class="diagram" /> -->
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
