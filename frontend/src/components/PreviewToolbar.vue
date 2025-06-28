<script setup>
import { inject, defineEmits } from 'vue'

const selectedFormat = inject('selectedFormat')
const emits = defineEmits(['downloadClicked'])

function download() {
  emit('downloadClicked')
}
</script>

<template>
  <div
    class="mb-4 flex h-9 h-[48px] items-center justify-between gap-2 border-t border-b border-zinc-500 bg-zinc-900 px-4 text-white shadow-sm"
  >
    <button
      @click="download"
      class="rounded bg-blue-700 px-4 py-1 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-800"
      type="button"
    >
      Download {{ selectedFormat }}
    </button>
  </div>
</template>
