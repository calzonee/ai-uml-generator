<template>
  <main class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">PlantUML Generator</h1>

    <!-- Auswahl des LLM -->
    <LLMSelector v-model:selectedLLM="selectedLLM" class="mb-4" />

    <!-- Prompt-Eingabe -->
    <PromptInput v-model:prompt="prompt" class="mb-4" />

    <!-- Generieren-Button -->
    <button
      class="px-4 py-2 rounded shadow hover:bg-gray-100 disabled:opacity-50"
      :disabled="loading"
      @click="generatePlantUML"
    >
      Generieren
    </button>

    <!-- Spinner -->
    <div v-if="loading" class="spinner mt-4"></div>

    <!-- Fehlermeldung -->
    <div v-if="error" class="error mt-4">{{ error }}</div>

    <!-- PlantUML-Editor -->
    <PlantUmlEditor
      v-if="plantumlCode"
      v-model:plantumlCode="plantumlCode"
      class="mt-6"
    />

    <!-- Diagramm-Anzeige -->
    <div v-if="diagramUrl" class="mt-6">
      <!-- SVG inline als Blob-URL -->
      <img :src="diagramUrl" alt="UML Diagramm" />
      <div class="mt-2">
        <label for="download-format">Download-Format:</label>
        <select id="download-format" v-model="downloadFormat" class="ml-2">
          <option value="png">PNG</option>
          <option value="svg">SVG</option>
        </select>
        <button
          class="px-3 py-1 ml-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          @click="downloadDiagram"
        >
          Herunterladen
        </button>
      </div>
    </div>

    <!-- Hinweis bei PlantUML-Fehler -->
    <div
      v-else-if="!loading && !error && plantumlCode"
      class="text-sm text-gray-600 mt-4"
    >
      Kein Bild – PlantUML-Fehler?
    </div>
  </main>
</template>

<script setup>
import PromptInput from "./components/PromptInput.vue";
import DiagramPreview from "./components/DiagramPreview.vue";
import TextEditor from "./components/TextEditor.vue";
</script>

<template>
  <h1 class="title text-green-500">ChatUML</h1>
  <div class="app">
    <div class="edit">
      <TextEditor />
      <PromptInput />
    </div>
    <DiagramPreview class="preview"/>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}
.app {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
}

/* Der Editorbereich links */
.edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid grey;
  border-radius: 1rem 1rem 0 0;
}

/* Diagramm rechts */
.preview {
}

/* Responsive Umschaltung */
@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }

  .preview {
    flex: none;
    width: 100%;
  }
}
</style>
