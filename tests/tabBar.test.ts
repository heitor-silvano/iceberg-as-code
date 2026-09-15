import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('TabBar features', () => {
  const tabBarPath = resolve(process.cwd(), 'app/components/layout/TabBar.vue')
  const tabBarSource = readFileSync(tabBarPath, 'utf-8')

  it('allows double click to rename filename', () => {
    expect(tabBarSource).toContain('@dblclick="startEditing"')
    expect(tabBarSource).toContain('<input')
    expect(tabBarSource).toContain('v-model="filename"')
  })
})
