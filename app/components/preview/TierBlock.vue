<script lang="ts" setup>
import { computed } from 'vue'
import type { IcebergLevel } from '~/lib/iceberg/types'
import { useIceberg } from '~/composables/useIceberg'

const props = defineProps<{
  level: IcebergLevel
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
  <div class="w-full flex flex-col space-y-2 py-2 border-b border-sky-300/40 last:border-b-0">
        <div class="flex items-center space-x-3">
            <div
        class="px-3 py-1 rounded-md text-xs font-bold text-white shadow-sm flex items-center shrink-0 tracking-wide uppercase"
        :style="{ backgroundColor: level.color }"
      >
        {{ level.title.toUpperCase() }}
      </div>
    </div>

        <div class="flex flex-wrap items-center gap-2 pt-1">
      <div
        v-for="(item, idx) in level.items"
        :key="idx"
        class="px-2.5 py-1 bg-white/95 rounded-md border border-sky-300/60 shadow-sm text-xs text-slate-800 transition-all hover:bg-white select-none"
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
        class="text-[11px] italic text-sky-800/50 py-1"
      >
        (nenhuma entrada neste tier)
      </div>
    </div>
  </div>
</template>
