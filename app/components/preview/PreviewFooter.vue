<script lang="ts" setup>
import { useIceberg } from '~/composables/useIceberg'

const { textAlpha, textStroke } = useIceberg()
</script>

<template>
  <div class="h-9 bg-zinc-900 border-t border-zinc-700/60 px-4 flex items-center justify-end space-x-5 select-none shrink-0 text-xs">
        <div class="flex items-center space-x-2">
            <svg class="w-3.5 h-3.5 text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" />
      </svg>
      <span class="text-zinc-200 font-medium text-[11px]">Text Alpha</span>

            <button
        type="button"
        @click="textAlpha = !textAlpha"
        class="w-7 h-4 rounded-full transition-colors relative focus:outline-none"
        :class="textAlpha ? 'bg-sky-600' : 'bg-sky-300'"
        title="Alternar opacidade do texto"
      >
        <span
          class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform shadow"
          :class="textAlpha ? 'translate-x-3.5' : 'translate-x-0.5'"
        ></span>
      </button>
    </div>

        <div class="flex items-center space-x-2">
            <svg class="w-3.5 h-3.5 text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </svg>
      <span class="text-zinc-200 font-medium text-[11px]">Text Stroke</span>

            <button
        type="button"
        @click="textStroke = !textStroke"
        class="w-7 h-4 rounded-full transition-colors relative focus:outline-none"
        :class="textStroke ? 'bg-sky-600' : 'bg-sky-300'"
        title="Alternar contorno do texto"
      >
        <span
          class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform shadow"
          :class="textStroke ? 'translate-x-3.5' : 'translate-x-0.5'"
        ></span>
      </button>
    </div>
  </div>
</template>
