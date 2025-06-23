
        <script setup>
        import { defineProps, defineEmits } from 'vue'

        const llms = [
          { id: 'openai', name: 'OpenAI' },
          { id: 'llama', name: 'LLaMa' },
          { id: 'mistral', name: 'Mistral' },
          { id: 'deepseek', name: 'DeepSeek' },
        ]

        const props = defineProps({
          selectedLLM: String,
        })
        const emit = defineEmits(['update:selectedLLM'])

        function selectLLM(event) {
          emit('update:selectedLLM', event.target.value)
        }
        </script>

        <template>
          <div>
            <label for="llm-select">LLM Modell auswählen:</label>
            <select id="llm-select" :value="selectedLLM" @change="selectLLM">
              <option v-for="llm in llms" :key="llm.id" :value="llm.id">{{ llm.name }}</option>
            </select>
          </div>
        </template>