import { describe, it, expect, beforeEach } from 'vitest'
import { useIceberg, resetStorageForTest } from '../app/composables/useIceberg'

describe('useIceberg composable', () => {
  beforeEach(() => {
    resetStorageForTest()
  })

  it('provides reactive code, filename and computed ast', () => {
    const { code, filename, ast } = useIceberg()
    expect(code.value).toBeDefined()
    expect(filename.value).toBe('untitled-tier-list')
    expect(ast.value.levels.length).toBeGreaterThan(0)
  })

  it('does not reset or clear code when typing tier followed by space', () => {
    const { code, ast } = useIceberg()
    const originalCode = code.value
    const newText = `${originalCode}\n\ntier `

    code.value = newText

    const anotherInstance = useIceberg()

    expect(anotherInstance.code.value).toBe(newText)
    expect(anotherInstance.code.value).toContain('tier ')
    expect(anotherInstance.ast.value.totalLevels).toBe(ast.value.totalLevels)
    expect(anotherInstance.ast.value.isValid).toBe(true)
  })

  it('keeps code intact across multiple component invocations', () => {
    const instance1 = useIceberg()
    const customContent = `tier "Alpha"\n  Item A\n\ntier \n`
    instance1.code.value = customContent

    const instance2 = useIceberg()
    const instance3 = useIceberg()

    expect(instance2.code.value).toBe(customContent)
    expect(instance3.code.value).toBe(customContent)
    expect(instance3.ast.value.totalLevels).toBe(2)
  })

  it('does not reload stale localStorage when subsequent components mount', () => {
    const storageMap = new Map<string, string>()
    storageMap.set('iceberg_code_content', 'tier "Old Tier"')
    const originalWindow = globalThis.window
    const originalLocalStorage = globalThis.localStorage

    const mockLocalStorage = {
      getItem: (key: string) => storageMap.get(key) ?? null,
      setItem: (key: string, val: string) => storageMap.set(key, val),
      removeItem: (key: string) => storageMap.delete(key),
      clear: () => storageMap.clear(),
      length: 0,
      key: () => null,
    }

    Object.defineProperty(globalThis, 'window', { value: {}, configurable: true, writable: true })
    Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, configurable: true, writable: true })

    try {
      const first = useIceberg()
      expect(first.code.value).toBe('tier "Old Tier"')

      first.code.value = 'tier "Old Tier"\n\ntier '

      const second = useIceberg()
      expect(second.code.value).toBe('tier "Old Tier"\n\ntier ')
    } finally {
      Object.defineProperty(globalThis, 'window', { value: originalWindow, configurable: true, writable: true })
      Object.defineProperty(globalThis, 'localStorage', { value: originalLocalStorage, configurable: true, writable: true })
    }
  })
})
