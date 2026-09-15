import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('AppToolbar styles', () => {
  const toolbarPath = resolve(process.cwd(), 'app/components/layout/AppToolbar.vue')
  const toolbarSource = readFileSync(toolbarPath, 'utf-8')

  it('allows the font size dropdown menu to appear above the text editor', () => {
    // The container should not clip absolute children (the dropdown)
    expect(toolbarSource).not.toContain('overflow-hidden')
    // It should have overflow-visible and a z-index to show above the text editor
    expect(toolbarSource).toContain('overflow-visible')
    expect(toolbarSource).toContain('z-10')
  })
})
