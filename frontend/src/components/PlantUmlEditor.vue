        <script setup>
        import { defineProps, defineEmits } from 'vue'

        const props = defineProps({
          plantumlCode: String,
        })
        const emit = defineEmits(['update:plantumlCode', 'updateDiagram'])

        function updateCode(event) {
          emit('update:plantumlCode', event.target.value)
          emit('updateDiagram')
        }
        </script>

        <template>
          <div>
            <textarea id="plantuml-editor" rows="10" cols="60" :value="plantumlCode" @input="updateCode"
    placeholder="PlantUML Code wird hier angezeigt und kann editiert werden."></textarea>
          </div>
        </template>