<script setup>
import { defineEmits, defineProps } from 'vue'

// const props = defineProps({
//   prompt: String,
// })

// const emit = defineEmits(['update:prompt'])

// function updateInput(event) {
//   emit('update:prompt', event.target.value)
// }
</script>

<template>
<textarea
  v-model="promptText"
  placeholder="Gib deinen Prompt ein..."
  class="prompt-text"
/>

</template>

<style scoped>
.prompt-text {
  resize: none;
  width: 100%;
}
</style>