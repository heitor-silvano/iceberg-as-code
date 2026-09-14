<script lang="ts" setup>
import { useIceberg } from '~/composables/useIceberg'

const { isDirty, isLiveSyncing } = useIceberg()
</script>

<template>
  <div class="h-9 bg-zinc-950/90 border-b border-zinc-800/80 px-3 flex items-center justify-between select-none shrink-0">
        <div class="flex items-center space-x-2">
      <div class="flex items-center space-x-2 px-3 py-1 bg-zinc-900 border-t-2 border-sky-500 border-x border-b border-x-zinc-800 border-b-transparent rounded-t text-xs font-mono text-zinc-200">
                <span class="text-sky-400 font-bold text-[13px]">{ }</span>
        <span>untitled-tier-list.iceberg</span>

                <span
          v-if="isDirty"
          class="w-2 h-2 rounded-full bg-amber-400 ml-1 inline-block animate-pulse"
          title="Alterações não salvas"
        ></span>
      </div>
    </div>

        <div class="flex items-center space-x-2 text-[11px] font-mono tracking-wider font-semibold text-zinc-400 mr-1">
      <div class="relative flex h-2 w-2">
        <span
          v-if="isLiveSyncing"
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <span :class="isLiveSyncing ? 'text-emerald-400' : 'text-zinc-400'">LIVE SYNC</span>
    </div>
  </div>
</template>
