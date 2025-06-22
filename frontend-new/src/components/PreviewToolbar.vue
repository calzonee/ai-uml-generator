<script setup>
import { ref } from 'vue'
const selectedFormat = ref('png')
</script>

<template>
  <div
    class="mb-4 flex h-9 h-[48px] items-center justify-between gap-2 border-t border-b border-zinc-500 bg-zinc-900 px-4 text-white shadow-sm"
  >
    <select
      class="rounded bg-zinc-700 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-zinc-400 focus:outline-none"
      v-model="selectedFormat"
    >
      <option value="png" selected>PNG</option>
      <option value="svg">SVG</option>
      <option value="ascii">ASCII</option>
    </select>

    <button
      class="rounded bg-blue-700 px-4 py-1 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-800"
      type="button"
    >
      Download {{ selectedFormat }}
    </button>
  </div>
</template>
