<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import { useIceberg } from '~/composables/useIceberg'

const { splitRatio } = useIceberg()
const containerRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const newRatio = (offsetX / rect.width) * 100

  if (newRatio >= 20 && newRatio <= 80) {
    splitRatio.value = Math.round(newRatio * 10) / 10
  }
}

const onMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="flex-1 flex w-full h-full min-h-0 overflow-hidden relative"
    :class="{ 'select-none cursor-col-resize': isDragging }"
  >
        <div
      class="h-full min-w-0 flex flex-col overflow-hidden"
      :style="{ width: `${splitRatio}%` }"
    >
      <slot name="left" />
    </div>

        <div
      @mousedown="startDrag"
      class="w-1.5 h-full bg-zinc-950 hover:bg-sky-500 active:bg-sky-500 cursor-col-resize transition-colors relative z-10 shrink-0 border-x border-zinc-800 flex items-center justify-center group"
      title="Arrastar para redimensionar"
    >
      <div class="w-0.5 h-6 bg-zinc-700 group-hover:bg-white rounded-full transition-colors"></div>
    </div>

        <div
      class="h-full min-w-0 flex flex-col overflow-hidden"
      :style="{ width: `${100 - splitRatio}%` }"
    >
      <slot name="right" />
    </div>
  </div>
</template>
