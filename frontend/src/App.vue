<script setup>
import { RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
</script>

<template>
  <div class="flex h-screen w-full flex-col">
    <HeaderComponent></HeaderComponent>

    <RouterView />

    <!-- <footer class="bg-gray-800 py-4 text-center text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} ChatUML. Alle Rechte vorbehalten.
    </footer> -->
  </div>
</template>

<style>
/* Optional: global styles oder Tailwind Ergänzungen */
</style>
