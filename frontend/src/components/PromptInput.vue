        <script setup>
        import { defineEmits, defineProps } from 'vue'

        const props = defineProps({
          prompt: String,
        })

        const emit = defineEmits(['update:prompt'])

        function updateInput(event) {
          emit('update:prompt', event.target.value)
        }
        </script>

        <template>
          <div>
            <textarea id="prompt-input" rows="4" cols="60" :value="prompt" @input="updateInput" placeholder="Gib hier deinen UML-Beschreibungstext ein..."></textarea>
          </div>
        </template>