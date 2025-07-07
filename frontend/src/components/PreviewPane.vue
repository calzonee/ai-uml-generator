<script setup lang="ts">
import { defineProps, inject, ref, onMounted, onBeforeUnmount } from 'vue'
import PreviewToolbar from './PreviewToolbar.vue'

// ❶ Props und Inject wie gehabt
const props = defineProps({
  imageSrc: String,
})
const selectedFormat = inject('selectedFormat', ref('png'))

// ❷ Download-Funktion wie gehabt
function handleDownload () {
  if (!props.imageSrc) return
  const link = document.createElement('a')
  link.href = props.imageSrc
  link.download = `diagram.${selectedFormat.value || 'png'}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ⇨ neues Reactive State für Fullscreen
const isFullScreen = ref(false)

// ⇨ Funktionen zum Öffnen/Schließen
function openFullScreen() {
  isFullScreen.value = true
}
function closeFullScreen() {
  isFullScreen.value = false
}

// ⇨ ESC-Taste schließt das Modal
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullScreen.value) {
    closeFullScreen()
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
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
        @click="openFullScreen"
      />
    </div>

    <!-- Fullscreen-Modal via Teleport ins body -->
    <teleport to="body">
      <div
        v-if="isFullScreen"
        class="fullscreen-overlay"
        @click.self="closeFullScreen"
      >
        <img
          :src="imageSrc"
          alt="Diagramm Vollbild"
          class="fullscreen-image"
        />
      </div>
    </teleport>
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
  cursor: zoom-in; /* Hinweis, dass Bild anklickbar ist */
}

/* Fullscreen Overlay */
.fullscreen-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out;
}
.fullscreen-image {
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  border-radius: 0.5rem;
}
</style>
