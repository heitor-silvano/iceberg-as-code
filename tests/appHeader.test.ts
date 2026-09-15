import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('AppHeader features', () => {
  const headerPath = resolve(process.cwd(), 'app/components/layout/AppHeader.vue')
  const headerSource = readFileSync(headerPath, 'utf-8')

  it('contains GitHub link before Export button', () => {
    expect(headerSource).toContain('https://github.com/heitor-silvano/iceberg-as-code')
    expect(headerSource).toContain('GitHub')
  })
})
