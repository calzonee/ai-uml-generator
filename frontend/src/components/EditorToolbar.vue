<script setup>
import { inject, computed, unref } from 'vue'

/* ───────── injects ───────── */
const selectedModel   = inject('selectedModel')
const selectedDiagram = inject('selectedDiagram')
const selectedFormat  = inject('selectedFormat', 'png')

/* ───────── Download-Button ───────── */
const emit        = defineEmits(['downloadClicked'])
const formatLabel = computed(() =>
  (unref(selectedFormat) || 'png').toUpperCase()
)
function download () {
  emit('downloadClicked', unref(selectedFormat) || 'png')
}
</script>

<template>
  <div
    class="scrollbar-thin mb-4 flex h-9 min-h-[48px] items-center justify-around gap-3 overflow-auto border-t border-b border-zinc-500 bg-zinc-900 px-4 text-white shadow-sm"
  >
    <!-- Modellwahl -->
    <div class="flex flex-nowrap">
      <label class="mr-1">Model:</label>
      <select
        v-model="selectedModel"
        class="rounded bg-zinc-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        <option value="llama3b">LLaMA&nbsp;3B</option>
        <option value="gpt4o">ChatGPT&nbsp;4o</option>
        <option value="o3">ChatGPT&nbsp;o3</option>
        <option value="claude">Claude</option>
      </select>
    </div>

    <!-- Diagrammtyp -->
    <div class="flex flex-nowrap">
      <label class="mr-1">Diagram:</label>
      <select
        v-model="selectedDiagram"
        class="rounded bg-zinc-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        <option value="none">Übersicht</option>
        <option value="class">Klassendiagramm</option>
        <option value="component">Komponentendiagramm</option>
        <option value="sequence">Sequenzdiagramm</option>
        <option value="mindmap">Mindmap</option>
      </select>
    </div>

    <!-- Ausgabeformat -->
    <select
      v-model="selectedFormat"
      class="rounded bg-zinc-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
    >
      <option value="png">PNG</option>
      <option value="svg">SVG</option>
    </select>

    <!-- Download -->
    <button
      @click="download"
      type="button"
      class="rounded bg-blue-700 px-4 py-1 text-sm font-semibold transition-colors duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-blue-800"
    >
      Download {{ formatLabel }}
    </button>
  </div>
</template>

<style scoped>
/* schlanker Scrollbar-Style (wie gehabt) */
.scrollbar-thin::-webkit-scrollbar { height:4px;width:4px }
.scrollbar-thin::-webkit-scrollbar-track { background:transparent }
.scrollbar-thin::-webkit-scrollbar-thumb { background:#6b7280;border-radius:4px }
.scrollbar-thin::-webkit-scrollbar-thumb:hover { background:#9ca3af }
.scrollbar-thin { scrollbar-width:thin; scrollbar-color:#6b7280 transparent }
</style>
