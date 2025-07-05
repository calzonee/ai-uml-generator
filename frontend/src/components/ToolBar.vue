<template>
  <div
    class="mb-4 flex h-9 items-center gap-2 border-t border-b border-zinc-500 bg-zinc-900 px-4 text-white shadow-sm"
  >
    <select
      class="rounded bg-zinc-700 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-zinc-400 focus:outline-none"
      v-model="selectedModel"
    >
      <option value="gpt4o"selected>ChatGPT 4o</option>
      <option value="llama3b">LLaMA 3B</option>
      <option value="claude">Claude</option>
    </select>

    <select
      class="rounded bg-zinc-700 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-zinc-400 focus:outline-none"
      v-model="selectedFormat"
    >
      <option value="png" selected>PNG</option>
      <option value="svg">SVG</option>
      <option value="ascii">ASCII</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const selectedModel = ref('gpt4o')
const selectedFormat = ref('png')
</script>
