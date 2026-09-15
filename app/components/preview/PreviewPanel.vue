<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { useIceberg } from '~/composables/useIceberg'
import TierBlock from './TierBlock.vue'
import PreviewFooter from './PreviewFooter.vue'

const { ast, previewZoom } = useIceberg()
const exportTargetRef = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const scrollLeft = ref(0)
const scrollTop = ref(0)

const onMouseDown = (e: MouseEvent) => {
  if (previewZoom.value <= 100 || !scrollContainerRef.value) return
  isDragging.value = true
  startX.value = e.pageX - scrollContainerRef.value.offsetLeft
  startY.value = e.pageY - scrollContainerRef.value.offsetTop
  scrollLeft.value = scrollContainerRef.value.scrollLeft
  scrollTop.value = scrollContainerRef.value.scrollTop

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  document.body.style.cursor = 'grabbing'
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainerRef.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainerRef.value.offsetLeft
  const y = e.pageY - scrollContainerRef.value.offsetTop
  const walkX = (x - startX.value)
  const walkY = (y - startY.value)
  scrollContainerRef.value.scrollLeft = scrollLeft.value - walkX
  scrollContainerRef.value.scrollTop = scrollTop.value - walkY
}

const onMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  document.body.style.cursor = ''
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  document.body.style.cursor = ''
})

defineExpose({
  exportTarget: exportTargetRef,
})
</script>

<template>
  <div class="w-full h-full flex flex-col bg-black relative overflow-hidden select-none">
    <div 
      ref="scrollContainerRef"
      class="flex-1 overflow-auto flex flex-col items-center relative z-10"
      :class="{
        'cursor-grab': previewZoom > 100 && !isDragging,
        'cursor-grabbing': isDragging
      }"
      @mousedown="onMouseDown"
    >
      <div
        ref="exportTargetRef"
        class="w-full relative shrink-0 rounded-xl overflow-hidden transition-transform duration-100 ease-out min-h-[800px]"
        :class="previewZoom > 100 ? 'origin-top-left' : 'origin-top'"
        :style="{ transform: `scale(${previewZoom / 100})` }"
      >
        <div class="absolute inset-0 z-0 pointer-events-none rounded-xl overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-[141px] bg-[#bfe3f7] z-0"></div>
          <div class="absolute inset-x-0 bottom-0 bg-black z-0 top-[141px]"></div>
        </div>

        <div class="absolute inset-0 z-0 flex flex-col items-center pointer-events-none mt-5">
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-b from-[#2877D222] to-[#000000] z-[5] top-[121px]"></div>
          
          <img src="/iceberg-tip.svg" class="w-[294px] shrink-0 relative z-20" />
          <div class="w-full h-[45px] shrink-0 -mt-[45px] relative z-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="waves" x="0" y="0" width="100" height="45" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 100 0 L 100 41 Q 75 45 50 41 T 0 41 Z" fill="#153D6C" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>
          <img src="/iceberg-body.svg" class="w-[446px] shrink-0 relative z-[4] -mt-[10px]" />
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-b from-[#2877D2] to-[#0B1F36] z-0 top-[121px]"></div>
        </div>

        <div class="relative z-10 flex flex-col w-full">
          <template v-if="ast.levels.length > 0">
            <TierBlock
              v-for="(level, index) in ast.levels"
              :key="level.id"
              :level="level"
              :index="index"
            />
          </template>

          <div
            v-else
            class="flex flex-col items-center justify-center py-16 text-sky-900/60 text-sm space-y-2 border-2 border-dashed border-sky-300/60 rounded-xl m-6"
          >
            <svg class="w-8 h-8 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="12 2 20 21 4 21" />
              <path d="M4 14h16" />
            </svg>
            <p class="font-medium">Nenhum nível encontrado no editor</p>
            <p class="text-xs text-sky-900/40">Digite <code class="font-mono bg-sky-200 px-1 py-0.5 rounded">level "Nome"</code> para começar</p>
          </div>
        </div>
      </div>
    </div>

        <PreviewFooter />
  </div>
</template>
