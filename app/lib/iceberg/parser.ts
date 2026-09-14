import type { IcebergConfig, IcebergLevel, IcebergResult } from './types'
import { getTierMetadata } from './zones'

export * from './types'

const defaultConfig: IcebergConfig = {
  maxRandomOffset: 10,
}

export const detectLevelName = (text: string): string => {
  return text
    .replace(/^level\s+/i, '')
    .replaceAll('"', '')
    .trim()
}

export const IcebergParser = (icebergLanguageText: string): IcebergResult => {
  const rows = icebergLanguageText.split('\n')
  const rawLevels: Array<{ title: string; items: string[]; line: number }> = []
  const config: IcebergConfig = { ...defaultConfig }
  let currentRowIndex: number = -1
  let isValid = true
  let error: string | undefined = undefined
  let errorLine: number | undefined = undefined

  for (let lineIdx = 0; lineIdx < rows.length; lineIdx++) {
    const rawRow = rows[lineIdx] ?? ''
    const trimmed = rawRow.trim()

    if (trimmed === '' || trimmed.startsWith('//')) {
      continue
    }

    if (rawRow.startsWith('max_random_offset')) {
      const parts = rawRow.split('=')
      if (parts.length < 2) {
        isValid = false
        error = `Invalid configuration format at line ${lineIdx + 1}`
        errorLine = lineIdx + 1
        continue
      }
      const val = parseFloat(parts[1]?.trim() ?? '')
      if (isNaN(val)) {
        isValid = false
        error = `Invalid number for max_random_offset at line ${lineIdx + 1}`
        errorLine = lineIdx + 1
      } else {
        config.maxRandomOffset = val
      }
      continue
    }

    if (/^level\s+/i.test(rawRow)) {
      const rowTitle = detectLevelName(rawRow)
      rawLevels.push({
        title: rowTitle || `Level ${rawLevels.length + 1}`,
        items: [],
        line: lineIdx + 1,
      })
      currentRowIndex = rawLevels.length - 1
      continue
    }

    if (/^(\s{2,}|\t)/.test(rawRow)) {
      if (currentRowIndex === -1) {

        rawLevels.push({
          title: 'First Level',
          items: [],
          line: lineIdx + 1,
        })
        currentRowIndex = 0
      }
      rawLevels[currentRowIndex]?.items.push(trimmed)
      continue
    }

    if (!trimmed.startsWith('#') && !trimmed.startsWith('-')) {

      isValid = false
      error = `Unrecognized syntax at line ${lineIdx + 1}: "${trimmed.slice(0, 20)}..."`
      errorLine = lineIdx + 1
    }
  }

  const totalLevels = rawLevels.length
  let totalEntries = 0

  const levels: IcebergLevel[] = rawLevels.map((raw, idx) => {
    const meta = getTierMetadata(idx, totalLevels)
    totalEntries += raw.items.length
    return {
      id: `tier-${idx}-${raw.title.toLowerCase().replace(/\s+/g, '-')}`,
      index: idx,
      levelNumber: idx + 1,
      title: raw.title,
      zone: meta.zone,
      depth: meta.depth,
      color: meta.color,
      items: raw.items,
    }
  })

  return {
    levels,
    config,
    totalLevels,
    totalEntries,
    lineCount: rows.length,
    isValid,
    error,
    errorLine,
  }
}

export default IcebergParser
