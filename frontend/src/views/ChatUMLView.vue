<script setup>
// ChatUMLView
//   -EditorPane.vue
//     -EditorToolbar.vue
//     -TextEditor.vue
//     -PromptInput.vue
//   -PreviewPane.vue
//     -PreviewToolbar.vue
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import EditorPane from './../components/EditorPane.vue'
import PreviewPane from './../components/PreviewPane.vue'

const TOOLBAR_HEIGHT = 48

const isDragging = ref(false)
const windowWidth = ref(window.innerWidth)
const splitSize = ref(window.innerWidth > 768 ? window.innerWidth / 2 : 300)

const isMobile = computed(() => windowWidth.value < 768)

const startDragging = () => {
  isDragging.value = true
}

const stopDragging = () => {
  isDragging.value = false
}

const containerRef = ref(null)

// Für Mobile Ansicht
const handleTouchStart = (e) => {
  isDragging.value = true
}

const handleTouchMove = (e) => {
  if (!isDragging.value || !containerRef.value) return

  const touch = e.touches[0]
  const containerTop = containerRef.value.getBoundingClientRect().top
  const relativeY = touch.clientY - containerTop
  const containerHeight = containerRef.value.clientHeight

  const maxHeight = containerHeight - TOOLBAR_HEIGHT
  splitSize.value = Math.max(100, Math.min(maxHeight, containerHeight - relativeY))
}

const handleTouchEnd = () => {
  isDragging.value = false
}

// Für Arbeit am Desktop
const handleMouseMove = (e) => {
  if (!isDragging.value || !containerRef.value) return

  if (isMobile.value) {
    const containerTop = containerRef.value.getBoundingClientRect().top
    const relativeY = e.clientY - containerTop
    const containerHeight = containerRef.value.clientHeight

    const maxHeight = containerHeight - TOOLBAR_HEIGHT
    splitSize.value = Math.max(100, Math.min(maxHeight, containerHeight - relativeY))
  } else {
    splitSize.value = Math.max(200, e.clientX)
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (!isDragging.value) {
    splitSize.value = window.innerWidth > 768 ? window.innerWidth / 2 : 300
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopDragging)
  window.addEventListener('resize', handleResize)

  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('resize', handleResize)

  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div
    ref="containerRef"
    class="flex h-full overflow-hidden"
    :class="isMobile ? 'flex-col-reverse' : 'flex-row'"
  >
    <div
      :style="isMobile ? `height: ${splitSize}px` : `width: ${splitSize}px`"
      class="overflow-auto"
    >
      <EditorPane />
    </div>

    <div
      class="flex items-center justify-center bg-zinc-300 hover:bg-gray-500"
      :class="
        isMobile ? 'h-[2px] w-full cursor-row-resize' : 'w-[2px] cursor-col-resize'
      "
      @mousedown="startDragging"
      @touchstart.prevent="handleTouchStart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 192 512"
        class="z-1 mx-auto h-8 w-4 rotate-90 overflow-visible rounded-full border bg-zinc-900 fill-zinc-500 p-1 md:rotate-0"
      >
        <path
          d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 448c0 17.7 14.3 32 32 32s32-14.3 32-32L64 64zm128 0c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 384c0 17.7 14.3 32 32 32s32-14.3 32-32l0-384z"
        />
      </svg>
    </div>

    <div class="flex-1 overflow-auto">
      <PreviewPane />
    </div>
  </div>
</template>
