<script lang="ts" setup>
import { ref } from 'vue'
import { useIceberg } from '~/composables/useIceberg'

const emit = defineEmits<{
  (e: 'export'): void
}>()

const { isExporting } = useIceberg()
const shareFeedback = ref(false)

const handleShare = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
      shareFeedback.value = true
      setTimeout(() => {
        shareFeedback.value = false
      }, 2000)
    }
  } catch (err) {
    console.error('Falha ao copiar URL:', err)
  }
}
</script>

<template>
  <header class="h-12 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between select-none shrink-0 z-20">
        <div class="flex items-center space-x-2.5">
      <img src="/app-icon.svg" alt="App Icon" class="w-5 h-5" />
      <span class="font-mono font-semibold text-xl leading-none tracking-tight text-[#89CEFF]">Iceberg as Code</span>
    </div>

        <div class="flex items-center space-x-3 text-xs">
            <button
        type="button"
        :disabled="isExporting"
        @click="emit('export')"
        class="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 rounded-md border border-zinc-700/60 font-medium transition-all hover:border-zinc-600 disabled:opacity-50"
        title="Exportar como PNG"
      >
        <svg v-if="!isExporting" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <svg v-else class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>{{ isExporting ? 'Exporting...' : 'Export' }}</span>
      </button>

            <button
        type="button"
        @click="handleShare"
        class="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-md border border-sky-500/30 font-medium transition-all hover:border-sky-500/50"
        title="Compartilhar Link"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>{{ shareFeedback ? 'Copied!' : 'Share' }}</span>
      </button>

    </div>
  </header>
</template>
