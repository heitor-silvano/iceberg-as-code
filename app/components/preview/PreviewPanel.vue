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
  <div class="w-full h-full flex flex-col bg-[#bfe3f7] relative overflow-hidden select-none">
        <div class="flex-1 overflow-auto p-6 flex flex-col items-center">
            <div
        ref="exportTargetRef"
        class="w-full max-w-2xl bg-[#bfe3f7] p-6 rounded-xl transition-transform duration-100 ease-out origin-top flex flex-col space-y-4"
        :style="{ transform: `scale(${previewZoom / 100})` }"
      >
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

        <PreviewFooter />
  </div>
</template>
