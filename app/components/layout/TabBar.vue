<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { useIceberg } from '~/composables/useIceberg'

const { isDirty, filename } = useIceberg()
const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

const stopEditing = () => {
  if (!filename.value.trim()) {
    filename.value = 'untitled-tier-list'
  }
  isEditing.value = false
}
</script>

<template>
  <div
    class="h-9 bg-zinc-950/90 border-b border-zinc-800/80 px-3 flex items-center justify-between select-none shrink-0">
    <div class="flex items-center space-x-2">
      <div 
        class="flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-mono text-zinc-200 cursor-pointer"
        @dblclick="startEditing"
        title="Duplo clique para renomear"
      >
        <span class="text-sky-400 font-bold text-[13px]">{}</span>
        
        <input
          v-if="isEditing"
          ref="inputRef"
          v-model="filename"
          @blur="stopEditing"
          @keydown.enter="stopEditing"
          class="bg-zinc-950 border border-sky-500 rounded px-1 outline-none text-white w-40"
        />
        <span v-else>{{ filename }}.iceberg</span>

        <span v-if="isDirty" class="w-2 h-2 rounded-full bg-amber-400 ml-1 inline-block animate-pulse"
          title="Alterações não salvas"></span>
      </div>
    </div>

  </div>
</template>
