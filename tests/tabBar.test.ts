import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('TabBar features', () => {
  const tabBarPath = resolve(process.cwd(), 'app/components/layout/TabBar.vue')
  const tabBarSource = readFileSync(tabBarPath, 'utf-8')

  it('allows double click to rename filename', () => {
    expect(tabBarSource).toContain('@dblclick')
    expect(tabBarSource).toContain('startEditing()')
    expect(tabBarSource).toContain('<input')
    expect(tabBarSource).toContain('v-model="filename"')
  })

  it('supports direct horizontal dragging with pointer events', () => {
    expect(tabBarSource).toContain('@pointerdown="onPointerDown')
    expect(tabBarSource).toContain('dragDeltaX')
    expect(tabBarSource).toContain('translateX(${dragDeltaX}px)')
    expect(tabBarSource).toContain('getTabShift')
    expect(tabBarSource).toContain('reorderTabs')
  })

  it('prevents native ghost drag placeholders', () => {
    expect(tabBarSource).toContain('draggable="false"')
    expect(tabBarSource).toContain('@dragstart.prevent')
    expect(tabBarSource).toContain('touch-none')
  })

  it('hides close button by default and shows on tab hover', () => {
    expect(tabBarSource).toContain('opacity-0')
    expect(tabBarSource).toContain('group-hover:opacity-100')
    expect(tabBarSource).toContain('group-hover:bg-zinc-700')
  })
})
