<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { useIceberg } from '~/composables/useIceberg'

const { tabs, activeTabId, addTab, closeTab, reorderTabs, getFilenameForTab, filename, dirtyMap } = useIceberg()
const isEditing = ref(false)
const inputRef = ref<HTMLInputElement[]>([])
const containerRef = ref<HTMLElement | null>(null)

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  if (inputRef.value[0]) {
    inputRef.value[0].focus()
    inputRef.value[0].select()
  }
}

const stopEditing = () => {
  if (!filename.value.trim()) {
    filename.value = 'untitled'
  }
  isEditing.value = false
}

const draggingIndex = ref<number | null>(null)
const targetDropIndex = ref<number | null>(null)
const dragDeltaX = ref(0)
const isDragging = ref(false)
const isReordering = ref(false)

let startX = 0
let tabPositions: { left: number; right: number; width: number; center: number }[] = []
let draggedWidth = 0
let tabGap = 4
let lastClickTime = 0
let lastClickedTabId = ''

const getTabShift = (index: number) => {
  if (!isDragging.value || draggingIndex.value === null || targetDropIndex.value === null) {
    return 0
  }
  if (index === draggingIndex.value) {
    return 0
  }
  const from = draggingIndex.value
  const to = targetDropIndex.value
  const shiftAmount = draggedWidth + tabGap

  if (from < to && index > from && index <= to) {
    return -shiftAmount
  }
  if (from > to && index >= to && index < from) {
    return shiftAmount
  }
  return 0
}

const onPointerDown = (e: PointerEvent, index: number, tabId: string) => {
  if (e.button !== 0 || isEditing.value) return
  const target = e.target as HTMLElement
  if (target.closest('.close-tab-btn') || target.closest('input') || target.closest('button')) return

  e.preventDefault()

  const now = Date.now()
  if (now - lastClickTime < 300 && lastClickedTabId === tabId) {
    startEditing()
    lastClickTime = 0
    return
  }
  lastClickTime = now
  lastClickedTabId = tabId

  activeTabId.value = tabId

  startX = e.clientX
  draggingIndex.value = index
  targetDropIndex.value = index
  dragDeltaX.value = 0
  isDragging.value = false

  const container = containerRef.value
  if (container) {
    const tabElements = Array.from(container.querySelectorAll<HTMLElement>('.tab-item'))
    tabPositions = tabElements.map(el => {
      const rect = el.getBoundingClientRect()
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        center: rect.left + rect.width / 2
      }
    })
    draggedWidth = tabPositions[index]?.width || 0
  }

  const onPointerMove = (moveEvent: PointerEvent) => {
    moveEvent.preventDefault()
    const delta = moveEvent.clientX - startX
    if (!isDragging.value && Math.abs(delta) > 2) {
      isDragging.value = true
    }

    if (!isDragging.value || draggingIndex.value === null) return

    dragDeltaX.value = delta

    const fromIndex = draggingIndex.value
    const currentTabPos = tabPositions[fromIndex]
    if (!currentTabPos) return

    const currentCenter = currentTabPos.center + delta

    let newTarget = fromIndex
    for (let i = 0; i < tabPositions.length; i++) {
      if (i === fromIndex) continue
      const targetPos = tabPositions[i]
      if (!targetPos) continue
      if (i < fromIndex) {
        if (currentCenter < targetPos.center) {
          if (newTarget === fromIndex || i < newTarget) {
            newTarget = i
          }
        }
      } else if (i > fromIndex) {
        if (currentCenter > targetPos.center) {
          if (newTarget === fromIndex || i > newTarget) {
            newTarget = i
          }
        }
      }
    }
    targetDropIndex.value = newTarget
  }

  const onPointerUp = async () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)

    const didReorder = isDragging.value && draggingIndex.value !== null && targetDropIndex.value !== null && draggingIndex.value !== targetDropIndex.value

    if (didReorder) {
      isReordering.value = true
      const newTabs = [...tabs.value]
      const [moved] = newTabs.splice(draggingIndex.value!, 1)
      if (moved) {
        newTabs.splice(targetDropIndex.value!, 0, moved)
        reorderTabs(newTabs)
      }
    }

    draggingIndex.value = null
    targetDropIndex.value = null
    dragDeltaX.value = 0
    isDragging.value = false

    if (didReorder) {
      await nextTick()
      if (containerRef.value) {
        void containerRef.value.offsetHeight
      }
      requestAnimationFrame(() => {
        isReordering.value = false
      })
    }
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}
</script>

<template>
  <div class="h-9 bg-zinc-950/90 border-b border-zinc-800/80 px-3 flex items-center justify-between select-none shrink-0 overflow-x-auto">
    <div ref="containerRef" class="flex items-center space-x-1 relative select-none" @dragstart.prevent>
      <div 
        v-for="(tab, index) in tabs" 
        :key="tab.id"
        draggable="false"
        class="tab-item group relative flex items-center space-x-1 px-3 py-1 border rounded text-xs font-mono select-none touch-none"
        :class="[
          activeTabId === tab.id ? 'bg-zinc-800 border-zinc-700 text-sky-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800',
          draggingIndex === index && isDragging 
            ? 'z-50 cursor-grabbing shadow-xl shadow-black/50 ring-1 ring-sky-500 bg-zinc-800 text-sky-300' 
            : 'z-10 cursor-grab',
          (!isDragging || draggingIndex !== index) && !isReordering ? 'transition-transform duration-150 ease-out' : ''
        ]"
        :style="draggingIndex === index && isDragging 
          ? { transform: `translateX(${dragDeltaX}px)`, transition: 'none' } 
          : { transform: `translateX(${getTabShift(index)}px)` }"
        @pointerdown="onPointerDown($event, index, tab.id)"
        @dragstart.prevent
        @dblclick="activeTabId === tab.id ? startEditing() : null"
        title="Clique duas vezes para renomear ou arraste para mover"
      >
        <input
          v-if="isEditing && activeTabId === tab.id"
          ref="inputRef"
          v-model="filename"
          @pointerdown.stop
          @mousedown.stop
          @blur="stopEditing"
          @keydown.enter="stopEditing"
          class="bg-zinc-950 border border-sky-500 rounded px-1 outline-none text-white w-24 font-normal cursor-text"
        />
        <span v-else :class="{'font-bold text-[13px]': activeTabId === tab.id}">{{ getFilenameForTab(tab.code) }}.iceberg</span>

        <span v-if="dirtyMap[tab.id]" class="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse shrink-0" title="Alterações não salvas"></span>
        
        <div 
          class="close-tab-btn absolute right-1 flex items-center justify-center text-zinc-500 hover:text-red-400 group-hover:bg-zinc-700 hover:bg-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-150 rounded p-0.5 cursor-pointer"
          @pointerdown.stop
          @mousedown.stop
          @click.stop="closeTab(tab.id)"
          title="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>
      </div>

      <button 
        @click="addTab" 
        class="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded px-2 py-1 text-xs font-mono transition-colors flex items-center justify-center shrink-0"
        title="Nova Aba"
      >
        +
      </button>
    </div>
  </div>
</template>
