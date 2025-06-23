<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  diagramType: String,
  styleOption: String,
  model: String
});

const emit = defineEmits(['update:model', 'update:diagramType', 'update:styleOption']);
</script>

<template>
  <transition name="slide-up">
    <div v-if="show" class="options">
      <label>
        Modell:
        <select :value="model" @change="emit('update:model', $event.target.value)">
          <option value="llama">LLaMA</option>
          <option value="openai">OpenAi</option>
        </select>
      </label>

      <div class="divider"></div>

      <label>
        Diagrammtyp:
        <select :value="diagramType" @change="emit('update:diagramType', $event.target.value)">
          <option value="sequence">Sequenzdiagramm</option>
          <option value="class">Klassendiagramm</option>
        </select>
      </label>

      <div class="divider"></div>

      <label>
        Style:
        <select :value="styleOption" @change="emit('update:styleOption', $event.target.value)">
          <option value="default">standard</option>
          <option value="colorful">farbenfroh</option>
          <option value="dark">dunkel</option>
        </select>
      </label>
    </div>
  </transition>
</template>

<style scoped>
.options {
  display: flex;
  justify-content: space-around;
  background: #4e4e4e;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px #00000080;
  margin-top: 0.5rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 700;
}

.divider {
  height: 3rem;
  width: 2px;
background-color: #ffffff80;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
