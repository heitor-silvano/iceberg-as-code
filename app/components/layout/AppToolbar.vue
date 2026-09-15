<script lang="ts" setup>
import { ref } from 'vue'
import { useIceberg } from '~/composables/useIceberg'

const {
  ast,
  splitRatio,
  editorFontSize,
  previewZoom,
  previewFont,
  textAlpha,
  insertTier,
  zoomIn,
  zoomOut,
  resetZoom,
} = useIceberg()

const isFontDropdownOpen = ref(false)
const fontSizes = ['12px', '13px', '14px', '16px']

const selectFontSize = (size: string) => {
  editorFontSize.value = size
  isFontDropdownOpen.value = false
}


</script>

<template>
  <div class="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center select-none text-xs shrink-0 overflow-visible z-10">
        <div
      class="h-full px-3 flex items-center justify-between border-r border-zinc-800/80 shrink-0"
      :style="{ width: `${splitRatio}%` }"
    >
            <div class="flex items-center space-x-2">
                <button
          type="button"
          @click="insertTier"
          class="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded border border-zinc-700/60 font-medium transition-colors"
          title="Adicionar novo Tier"
        >
          <span class="text-sky-400 font-bold">#</span>
          <span>Tier</span>
        </button>

                <div class="relative">
          <button
            type="button"
            @click="isFontDropdownOpen = !isFontDropdownOpen"
            class="flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700/60 font-mono transition-colors"
          >
            <span>{{ editorFontSize }}</span>
            <svg class="w-3 h-3 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

                    <div
            v-if="isFontDropdownOpen"
            class="absolute left-0 mt-1 w-20 bg-zinc-800 border border-zinc-700 rounded shadow-xl z-50 py-1 font-mono text-xs"
          >
            <button
              v-for="size in fontSizes"
              :key="size"
              type="button"
              @click="selectFontSize(size)"
              class="w-full text-left px-3 py-1 hover:bg-sky-500 hover:text-white text-zinc-300 transition-colors"
              :class="{ 'bg-zinc-700/60 text-sky-300 font-semibold': editorFontSize === size }"
            >
              {{ size }}
            </button>
          </div>
        </div>


      </div>

            <div class="text-[11px] font-mono text-zinc-400 font-medium whitespace-nowrap pl-2">
        <span class="text-zinc-300 font-semibold">{{ ast.totalLevels }}</span> Tiers ·
        <span class="text-zinc-300 font-semibold">{{ ast.totalEntries }}</span> Entries
      </div>
    </div>

        <div
      class="h-full px-4 flex items-center justify-between shrink-0"
      :style="{ width: `${100 - splitRatio}%` }"
    >
            <div class="flex items-center space-x-1.5">
        <button
          type="button"
          @click="zoomOut"
          class="w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded border border-zinc-700/60 transition-colors"
          title="Diminuir Zoom"
        >
          -
        </button>

        <span class="w-12 text-center font-mono text-xs text-zinc-300">
          {{ previewZoom }}%
        </span>

        <button
          type="button"
          @click="zoomIn"
          class="w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded border border-zinc-700/60 transition-colors"
          title="Aumentar Zoom"
        >
          +
        </button>

                <button
          type="button"
          @click="resetZoom"
          class="w-6 h-6 ml-1 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded border border-zinc-700/60 transition-colors"
          title="Redefinir Zoom (100%)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" />
          </svg>
          <span class="text-zinc-400 font-medium text-[11px]">Background Alpha</span>

          <input
            type="range"
            v-model="textAlpha"
            min="0"
            max="100"
            class="w-20 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            title="Ajustar opacidade do fundo do texto"
          />
        </div>

        <div class="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
          <button
            type="button"
            @click="previewFont = 'sans'"
            class="px-2.5 py-0.5 text-[11px] rounded-md font-medium transition-all"
            :class="previewFont === 'sans' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'"
          >
            Sans
          </button>
          <button
            type="button"
            @click="previewFont = 'mono'"
            class="px-2.5 py-0.5 text-[11px] font-mono rounded-md transition-all"
            :class="previewFont === 'mono' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'"
          >
            Mono
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
