import { describe, it, expect } from 'vitest'
import { IcebergParser, detectLevelName } from '../app/lib/iceberg/parser'

describe('detectLevelName', () => {
  it('detects empty title when typing level and space', () => {
    expect(detectLevelName('level ')).toBe('')
  })

  it('detects empty title when typing level without space', () => {
    expect(detectLevelName('level')).toBe('')
  })

  it('detects empty title when typing level with multiple spaces', () => {
    expect(detectLevelName('level    ')).toBe('')
  })

  it('extracts quoted level name', () => {
    expect(detectLevelName('level "Deep Waters"')).toBe('Deep Waters')
  })

  it('extracts unquoted level name', () => {
    expect(detectLevelName('level Deep Waters')).toBe('Deep Waters')
  })
})

describe('IcebergParser', () => {
  it('parses input ending in level and space without error or dropping content', () => {
    const code = `level "First Level"\n  Google\n\nlevel `
    const result = IcebergParser(code)

    expect(result.isValid).toBe(true)
    expect(result.totalLevels).toBe(2)
    expect(result.levels[0]?.title).toBe('First Level')
    expect(result.levels[0]?.items).toEqual(['Google'])
    expect(result.levels[1]?.title).toBe('Level 2')
    expect(result.levels[1]?.items).toEqual([])
  })

  it('parses single line level and space', () => {
    const code = 'level '
    const result = IcebergParser(code)

    expect(result.isValid).toBe(true)
    expect(result.totalLevels).toBe(1)
    expect(result.levels[0]?.title).toBe('Level 1')
    expect(result.levels[0]?.items).toEqual([])
  })

  it('parses single line level without space', () => {
    const code = 'level'
    const result = IcebergParser(code)

    expect(result.isValid).toBe(true)
    expect(result.totalLevels).toBe(1)
    expect(result.levels[0]?.title).toBe('Level 1')
  })

  it('parses standard document with multiple levels and entries', () => {
    const code = `max_random_offset = 15

// header comment
level "The Tip"
  Item 1
  Item 2

level "The Abyss"
  Item 3
`
    const result = IcebergParser(code)

    expect(result.isValid).toBe(true)
    expect(result.config.maxRandomOffset).toBe(15)
    expect(result.totalLevels).toBe(2)
    expect(result.totalEntries).toBe(3)
    expect(result.levels[0]?.title).toBe('The Tip')
    expect(result.levels[0]?.items).toEqual(['Item 1', 'Item 2'])
    expect(result.levels[1]?.title).toBe('The Abyss')
    expect(result.levels[1]?.items).toEqual(['Item 3'])
  })

  it('flags unrecognized syntax on invalid lines', () => {
    const code = `invalid_keyword without syntax`
    const result = IcebergParser(code)

    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.errorLine).toBe(1)
  })
})
