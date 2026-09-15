import { describe, it, expect } from 'vitest'
import { IcebergParser, detectTierName } from '../app/lib/iceberg/parser'

describe('detectTierName', () => {
  it('detects empty title when typing tier and space', () => {
    expect(detectTierName('tier ')).toBe('')
  })

  it('detects empty title when typing tier without space', () => {
    expect(detectTierName('tier')).toBe('')
  })

  it('detects empty title when typing tier with multiple spaces', () => {
    expect(detectTierName('tier    ')).toBe('')
  })

  it('extracts quoted tier name', () => {
    expect(detectTierName('tier "Deep Waters"')).toBe('Deep Waters')
  })

  it('extracts unquoted tier name', () => {
    expect(detectTierName('tier Deep Waters')).toBe('Deep Waters')
  })
})

describe('IcebergParser', () => {
  it('parses input ending in tier and space without error or dropping content', () => {
    const code = `tier "First Level"\n  Google\n\ntier `
    const result = IcebergParser(code)

    expect(result.isValid).toBe(true)
    expect(result.totalLevels).toBe(2)
    expect(result.levels[0]?.title).toBe('First Level')
    expect(result.levels[0]?.items).toEqual(['Google'])
    expect(result.levels[1]?.title).toBe('Tier 2')
    expect(result.levels[1]?.items).toEqual([])
  })

  it('parses single line tier and space', () => {
    const code = 'tier '
    const result = IcebergParser(code)

    expect(result.isValid).toBe(true)
    expect(result.totalLevels).toBe(1)
    expect(result.levels[0]?.title).toBe('Tier 1')
    expect(result.levels[0]?.items).toEqual([])
  })

  it('parses settings block and extracts values', () => {
    const code = `settings: {
  title: "My Iceberg";
  background_alpha: 50;
  font: "mono";
}

tier "Top Level"
  Item
`
    const result = IcebergParser(code)

    expect(result.config.title).toBe('My Iceberg')
    expect(result.config.backgroundAlpha).toBe(50)
    expect(result.config.font).toBe('mono')
    expect(result.levels.length).toBe(1)
  })

  it('parses single line tier without space', () => {
    const code = 'tier'
    const result = IcebergParser(code)

    expect(result.isValid).toBe(true)
    expect(result.totalLevels).toBe(1)
    expect(result.levels[0]?.title).toBe('Tier 1')
  })

  it('parses standard document with multiple levels and entries', () => {
    const code = `max_random_offset = 15

// header comment
tier "The Tip"
  Item 1
  Item 2

tier "The Abyss"
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
