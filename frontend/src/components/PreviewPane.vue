<script setup>
import { defineProps, inject, ref } from 'vue'
import PreviewToolbar from './PreviewToolbar.vue'

// ❶ Bild-Quelle kommt als Prop
const props = defineProps({
  imageSrc: String,
})

// ❷ Format (für Dateiendung)
const selectedFormat = inject('selectedFormat', ref('png'))

/**
 * Lädt die aktuell angezeigte Grafik herunter.
 * – Bei PNG-Blob-URLs: funktioniert direkt
 * – Bei Base-64-SVG: Browser speichert korrekt als .svg
 */
function handleDownload () {
  if (!props.imageSrc) return

  const link = document.createElement('a')
  link.href = props.imageSrc
  link.download = `diagram.${selectedFormat.value || 'png'}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="block">
    <PreviewToolbar @downloadClicked="handleDownload" />
    <div class="preview">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        alt="Diagramm-Vorschau"
        class="diagram"
      />
    </div>
  </div>
</template>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.diagram {
  max-height: 65vh;
  max-width: 48vw;
}
</style>
