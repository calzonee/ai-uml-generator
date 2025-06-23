<script setup>
import { ref } from 'vue';
import PromptOptions from './PromptOptions.vue';
import PromptTextarea from './PromptTextarea.vue';
import PromptSendButton from './PromptSendButton.vue';

const showOptions = ref(false);
const model = ref('llama');
const diagramType = ref('sequence');
const styleOption = ref('default');

const toggleOptions = () => {
  showOptions.value = !showOptions.value;
};
</script>

<template>
  <div class="prompt-input-container">
    <!-- Die "Toast-Karte" -->
    <PromptOptions class="options-wrapper"
      :show="showOptions"
      v-model:model="model"
      v-model:diagramType="diagramType"
      v-model:styleOption="styleOption"
    />

    <div class="input-bar">
      <button @click="toggleOptions">Optionen</button>
      <PromptTextarea />
      <PromptSendButton />
    </div>
  </div>
</template>

<style scoped>
.prompt-input-container {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #676767;
  /* border: 1px solid grey; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 1rem 1rem 0 0;
  padding: 4px;
  margin-top: 3.5rem;
  z-index: 20;
}

.options-wrapper {
  position: absolute;
  bottom: 1rem;
  left: 0rem;
  right: 0;
  z-index: 10;
  padding-bottom: 2.5rem;
  border-radius: 1rem 1rem 0 0;
}
</style>
