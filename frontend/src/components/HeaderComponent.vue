<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="flex w-full items-center justify-between bg-zinc-950 px-6 py-4 text-white border"
  >
    <h2 class="text-lg font-semibold tracking-wide">ChatUML</h2>
    <nav class="flex items-center gap-4 text-sm">
      <RouterLink
        to="/chatuml"
        class="transition-colors hover:text-blue-300 hover:underline"
      >
        Demo
      </RouterLink>

      <RouterLink
        to="/monitor"
        class="transition-colors hover:text-blue-300 hover:underline"
      >
        Transparency
      </RouterLink>

      <RouterLink
        to="/login"
        class="rounded-full border border-white px-2 py-1 text-white transition hover:bg-white hover:text-gray-800"
      >
        Login
      </RouterLink>
    </nav>
  </header>
</template>
