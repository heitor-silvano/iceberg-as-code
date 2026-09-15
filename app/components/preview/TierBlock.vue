<script lang="ts" setup>
import { computed } from 'vue'
import type { IcebergLevel } from '~/lib/iceberg/types'
import { useIceberg } from '~/composables/useIceberg'

const props = defineProps<{
  level: IcebergLevel
  index?: number
}>()

const { previewFont, textAlpha, textStroke } = useIceberg()

const fontClass = computed(() => {
  if (previewFont.value === 'mono') return 'font-mono'
  return 'font-sans'
})

const itemTextStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (textStroke.value) {
    styles.WebkitTextStroke = '0.5px rgba(0, 0, 0, 0.8)'
    styles.textShadow = '0 0 1px rgba(0,0,0,0.5)'
  }
  return styles
})
</script>

<template>
  <div
    class="w-full flex flex-col space-y-2 p-1 last:border-b-0"
    :class="[
      index === 0 ? 'border-b-0 h-[141px]' : 'border-b border-sky-200/50 border-dashed first:border-b-0'
    ]"
  >
    <div class="flex items-center justify-start w-full">
      <div
        class="px-2 py-1 rounded-md text-sm font-bold text-white bg-black shadow-sm flex items-center shrink-0"
      >
        {{ level.title }}
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-2 p-12 w-full">
      <div
        v-for="(item, idx) in level.items"
        :key="idx"
        class="px-2.5 py-1 bg-white/95 rounded-md border border-sky-300/60 shadow-sm text-xs text-slate-800 transition-all hover:bg-white select-none text-center"
        :class="[
          fontClass,
          textAlpha ? 'opacity-70' : 'opacity-100'
        ]"
        :style="itemTextStyles"
      >
        {{ item }}
      </div>

      <div
        v-if="level.items.length === 0"
        class="text-[11px] italic text-sky-200/60 py-1 text-center w-full"
      >
        (nenhuma entrada neste tier)
      </div>
    </div>
  </div>
</template>
