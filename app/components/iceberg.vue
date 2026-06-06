<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import type { IcebergConfig } from '~/lib/iceberg/parser';

const props = defineProps<{
  levels: Array<{ title: string; items: string[] }>
  config: IcebergConfig
}>()

const LEVEL_HEIGHT = 140
const SVG_WIDTH = 680
const PADDING = 4
const GAP = 20
const MAX_WIDTH = SVG_WIDTH - 80

const bboxes = ref<Record<string, DOMRect>>({})
const textRefs = ref<Record<string, SVGTextElement>>({})
const randomOffsets = ref<Record<string, number>>({})
const ready = ref(false)

function setTextRef(el: unknown, i: number, j: number) {
  if (el) textRefs.value[`${i}-${j}`] = el as SVGTextElement
}

function getBbox(i: number, j: number) {
  return bboxes.value[`${i}-${j}`]
}

const levelsSignature = computed(() =>
  props.levels.map(l => `${l.title}|${l.items.join(',')}`).join(';')
)

const itemPositions = computed(() => {
  const positions: Record<string, { x: number; row: number }> = {}

  for (let i = 0; i < props.levels.length; i++) {
    const items = props.levels[i]?.items ?? []

    const rows: number[][] = [[]]
    let lineWidth = 0

    for (let j = 0; j < items.length; j++) {
      const b = bboxes.value[`${i}-${j}`]
      const itemWidth = (b?.width ?? 60) + PADDING * 2 + GAP

      if (lineWidth + itemWidth > MAX_WIDTH && (rows[rows.length - 1]?.length ?? 0) > 0) {
        rows.push([])
        lineWidth = 0
      }

      rows[rows.length - 1]?.push(j)
      lineWidth += itemWidth
    }

    for (let r = 0; r < rows.length; r++) {
      let totalWidth = 0
      for (const j of rows[r] ?? []) {
        const b = bboxes.value[`${i}-${j}`]
        totalWidth += (b?.width ?? 60) + PADDING * 2 + GAP
      }
      totalWidth -= GAP

      let currentX = (SVG_WIDTH - totalWidth) / 2
      for (const j of rows[r] ?? []) {
        const b = bboxes.value[`${i}-${j}`]
        positions[`${i}-${j}`] = { x: currentX, row: r }
        currentX += (b?.width ?? 60) + PADDING * 2 + GAP
      }
    }
  }

  return positions
})

function itemX(i: number, j: number) {
  return itemPositions.value[`${i}-${j}`]?.x ?? 40
}

function itemRow(i: number, j: number) {
  return itemPositions.value[`${i}-${j}`]?.row ?? 0
}

function levelRowCount(i: number) {
  const items = props.levels[i]?.items ?? []
  if (items.length === 0) return 1
  return (itemPositions.value[`${i}-${items.length - 1}`]?.row ?? 0) + 1
}

const levelOffsets = computed(() => {
  const offsets: number[] = []
  let total = 0
  for (let i = 0; i < props.levels.length; i++) {
    offsets.push(total)
    const rows = levelRowCount(i)
    total += Math.max(LEVEL_HEIGHT, 60 + rows * (16 + GAP))
  }
  return offsets
})

const svgHeight = computed(() => {
  let total = 0
  for (let i = 0; i < props.levels.length; i++) {
    const rows = levelRowCount(i)
    total += Math.max(LEVEL_HEIGHT, 60 + rows * (16 + GAP))
  }
  return total + 40
})

watch(levelsSignature, async (newSig, oldSig) => {
  ready.value = false

  const offsets: Record<string, number> = {}
  for (let i = 0; i < props.levels.length; i++) {
    const items = props.levels[i]?.items ?? []
    for (let j = 0; j < items.length; j++) {
      const existing = randomOffsets.value[`${i}-${j}`]
      offsets[`${i}-${j}`] = existing !== undefined ? existing : (Math.random() - 0.5) * props.config.maxRandomOffset
    }
  }
  randomOffsets.value = offsets

  await nextTick()
  for (const [key, el] of Object.entries(textRefs.value)) {
    if (el) bboxes.value[key] = el.getBBox()
  }
  ready.value = true
}, { immediate: true })

watch(() => props.config.maxRandomOffset, async () => {
  const offsets: Record<string, number> = {}
  for (let i = 0; i < props.levels.length; i++) {
    const items = props.levels[i]?.items ?? []
    for (let j = 0; j < items.length; j++) {
      offsets[`${i}-${j}`] = (Math.random() - 0.5) * props.config.maxRandomOffset
    }
  }
  randomOffsets.value = offsets
})
</script>

<template>
  <svg width="100%" :viewBox="`0 0 ${SVG_WIDTH} ${svgHeight}`" xmlns="http://www.w3.org/2000/svg"
    :style="{ background: 'aqua', visibility: ready ? 'visible' : 'hidden' }">
    <g v-for="(level, i) in levels" :key="i">
      <line v-if="i > 0" x1="0" :y1="levelOffsets[i] ?? 0" :x2="SVG_WIDTH" :y2="levelOffsets[i] ?? 0" stroke="black"
        stroke-width="1" />

      <text x="40" :y="(levelOffsets[i] ?? 0) + 24" font-size="13" font-weight="600" fill="#111">{{ level.title
      }}</text>

      <g v-for="(item, j) in level.items" :key="j">
        <rect v-if="getBbox(i, j)" :x="itemX(i, j) - PADDING"
          :y="(levelOffsets[i] ?? 0) + 48 + itemRow(i, j) * (16 + GAP) + (randomOffsets[`${i}-${j}`] ?? 0) - (getBbox(i, j)?.height ?? 0) - PADDING"
          :width="(getBbox(i, j)?.width ?? 0) + PADDING * 2" :height="(getBbox(i, j)?.height ?? 0) + PADDING * 2" rx="4"
          fill="white" stroke="none" />
        <text :ref="(el) => setTextRef(el, i, j)" :x="itemX(i, j)"
          :y="(levelOffsets[i] ?? 0) + 44 + itemRow(i, j) * (16 + GAP) + (randomOffsets[`${i}-${j}`] ?? 0)" fill="#444"
          font-size="12" style="user-select: none">{{ item }}</text>
      </g>
    </g>
  </svg>
</template>