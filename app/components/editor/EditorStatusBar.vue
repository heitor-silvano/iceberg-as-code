<script lang="ts" setup>
import { useIceberg } from '~/composables/useIceberg'

const { ast } = useIceberg()
</script>

<template>
  <div class="h-6 bg-zinc-950 border-t border-zinc-800 px-3 flex items-center justify-between text-[11px] text-zinc-400 select-none">
        <div class="flex items-center space-x-3">
      <span>{{ ast.lineCount }} lines</span>
      <span class="text-zinc-700">|</span>
      <span>{{ ast.totalLevels }} tiers</span>
      <span class="text-zinc-700">|</span>
      <span>{{ ast.totalEntries }} entries</span>
    </div>

        <div class="flex items-center space-x-4">

            <div class="flex items-center space-x-2 text-zinc-400">
        <span>UTF-8</span>
        <span>·</span>
        <span>LF</span>
        <span>·</span>
        <span class="text-zinc-300 font-medium">Iceberg</span>
      </div>
    </div>
  </div>
</template>
