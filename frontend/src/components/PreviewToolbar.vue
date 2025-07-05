<script setup>
import { ref, inject, computed, unref } from 'vue'

/* Inject mit Fallback als reaktives Ref */
const selectedFormat = inject('selectedFormat', ref('png'))

/* Schönes Label fürs Button-Caption */
const formatLabel = computed(() =>
  (unref(selectedFormat) || 'png').toUpperCase()
)

const emit = defineEmits(['downloadClicked'])

function download() {
  emit('downloadClicked', unref(selectedFormat) || 'png')
}
</script>

<template>
  <div
    class="mb-4 flex h-12 items-center justify-between gap-2 border-t border-b border-zinc-500 bg-zinc-900 px-4 text-white shadow-sm"
  >
    <!-- <button
      @click="download"
      class="rounded bg-blue-700 px-4 py-1 text-sm font-semibold transition-colors duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-blue-800"
      type="button"
    >
      Download {{ formatLabel }}
    </button> -->
  </div>
</template>

<style scoped>
/* keine zusätzlichen Styles nötig */
</style>
