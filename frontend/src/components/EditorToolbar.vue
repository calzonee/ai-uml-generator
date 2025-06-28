<script setup>
import { inject } from 'vue'

const selectedModel = inject('selectedModel')
const selectedDiagram = inject('selectedDiagram')
const darkMode = inject('darkMode')
const selectedFormat = inject('png')
</script>

<template>
  <div
    class="scrollbar-thin mb-4 flex h-9 min-h-[48px] items-center justify-around gap-3 overflow-auto border-t border-b border-zinc-500 bg-zinc-900 px-4 text-white shadow-sm"
  >
    <div class="flex flex-nowrap">
      <label class="mr-1">Model:</label>
      <select
        class="rounded bg-zinc-700 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-zinc-400 focus:outline-none"
        v-model="selectedModel"
      >
        <option value="llama3b" selected>LLaMA 3B</option>
        <option value="gpt4o">ChatGPT 4o</option>
        <option value="claude">Claude</option>
      </select>
    </div>

    <div class="flex flex-nowrap">
      <label class="mr-1">Diagram:</label>
      <select
        class="rounded bg-zinc-700 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-zinc-400 focus:outline-none"
        v-model="selectedDiagram"
      >
        <option value="none" selected>Übersicht</option>
        <option value="class">Klassendiagramm</option>
        <option value="component">Komponentendiagramm</option>
        <option value="sequence">Sequenzdiagramm</option>
        <option value="mindmap">Mindmap</option>
      </select>
    </div>

    <div class="flex items-center">
      <input type="checkbox" v-model="darkMode" />
      <label>Dunkel</label>
    </div>

    <select
      class="rounded bg-zinc-700 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-zinc-400 focus:outline-none"
      v-model="selectedFormat"
    >
      <option value="png" selected>PNG</option>
      <option value="svg">SVG</option>
    </select>
  </div>
</template>

<style scoped>
/* src/assets/scrollbar.css oder in main.css */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #6b7280; /* Tailwind: zinc-500 */
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* Tailwind: zinc-400 */
}

/* Firefox */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #6b7280 transparent;
}
</style>
