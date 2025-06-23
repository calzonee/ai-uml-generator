<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="h-full bg-stone-950">
    <h1>Welcome to ChatUML</h1>
    <div class="">
      <RouterLink to="/demo">Checkout Demo</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
    </div>
  </div>
</template>
