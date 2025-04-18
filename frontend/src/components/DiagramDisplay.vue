        <script setup>
        import { defineProps, defineEmits } from 'vue'

        const props = defineProps({
          diagramUrl: String,
        })
        const emit = defineEmits(['download'])
        </script>

        <template>
          <div>
            <h2>Diagramm:</h2>
            <img :src="diagramUrl" alt="UML Diagramm" style="max-width:100%; height:auto; border: 1px solid #ccc;" />
            <br />
            <button @click="$emit('download')">Download PNG</button>
          </div>
        </template>