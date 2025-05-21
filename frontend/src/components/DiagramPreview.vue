<template>
  <div class="preview">
    <div class="preview-buttons">
      <button>Download SVG</button>
      <button>Download PNG</button>
    </div>
    <hr width="">
    <img src="../assets/usecase-ai-uml-generator.png" alt="" class="diagram">
    <!-- <img src="../assets/sequenz-ai-uml-generator.png" alt="" class="diagram"> -->
  </div>
</template>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.preview-buttons {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

hr {
  width: 100%;
  box-shadow: 0px 0px 5px #ffffff;
}

.diagram {
  max-height: 65vh;
  max-width: 48vw;
}
</style>