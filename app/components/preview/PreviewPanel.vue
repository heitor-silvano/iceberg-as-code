<script lang="ts" setup>
import { ref } from 'vue'
import { useIceberg } from '~/composables/useIceberg'
import TierBlock from './TierBlock.vue'
import PreviewFooter from './PreviewFooter.vue'

const { ast, previewZoom } = useIceberg()
const exportTargetRef = ref<HTMLElement | null>(null)

defineExpose({
  exportTarget: exportTargetRef,
})
</script>

<template>
  <div class="w-full h-full flex flex-col bg-gradient-to-b from-[#bfe3f7] to-[#000000] relative overflow-hidden select-none">
    <div class="flex-1 overflow-auto flex flex-col items-center">
      <div
        ref="exportTargetRef"
        class="w-full relative p-6 rounded-xl transition-transform duration-100 ease-out origin-top min-h-[800px]"
        :style="{ transform: `scale(${previewZoom / 100})` }"
      >
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

        <div class="relative z-10 flex flex-col space-y-4 w-full h-full">
          <template v-if="ast.levels.length > 0">
            <TierBlock
              v-for="level in ast.levels"
              :key="level.id"
              :level="level"
            />
          </template>

          <div
            v-else
            class="flex flex-col items-center justify-center py-16 text-sky-900/60 text-sm space-y-2 border-2 border-dashed border-sky-300/60 rounded-xl"
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
