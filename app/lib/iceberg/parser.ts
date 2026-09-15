import type { IcebergConfig, IcebergLevel, IcebergResult } from './types'
import { getTierMetadata } from './zones'

export * from './types'

const defaultConfig: IcebergConfig = {
  maxRandomOffset: 10,
}

export const detectTierName = (text: string): string => {
  return text
    .replace(/^tier(\s+|$)/i, '')
    .replaceAll('"', '')
    .trim()
}

export const IcebergParser = (icebergLanguageText: string): IcebergResult => {
  const config: IcebergConfig = { ...defaultConfig }
  let processedText = icebergLanguageText

  const settingsMatch = processedText.match(/settings:\s*\{([^}]*)\}/)
  if (settingsMatch) {
    const settingsContent = settingsMatch[1] || ''
    const pairs = settingsContent.split(/(?:;|\n)+/)
    for (const pair of pairs) {
      const parts = pair.split(/:(.*)/s)
      if (parts.length > 1) {
        const key = parts[0]?.trim()
        const val = parts[1]?.trim().replace(/^"|"$/g, '').trim()
        if (key === 'title') {
          config.title = val
        } else if (key === 'background_alpha') {
          const alpha = parseInt(val || '', 10)
          if (!isNaN(alpha)) config.backgroundAlpha = alpha
        } else if (key === 'font') {
          if (val === 'sans' || val === 'mono') config.font = val as 'sans' | 'mono'
        }
      }
    }
    const newlines = settingsMatch[0].replace(/[^\n]/g, '')
    processedText = processedText.replace(settingsMatch[0], newlines)
  }

  const rows = processedText.split('\n')
  const rawLevels: Array<{ title: string; items: string[]; line: number }> = []
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

    if (/^tier(\s+|$)/i.test(rawRow)) {
      const rowTitle = detectTierName(rawRow)
      rawLevels.push({
        title: rowTitle || `Tier ${rawLevels.length + 1}`,
        items: [],
        line: lineIdx + 1,
      })
      currentRowIndex = rawLevels.length - 1
      continue
    }

    if (/^(\s{2,}|\t)/.test(rawRow)) {
      if (currentRowIndex === -1) {

        rawLevels.push({
          title: 'First Tier',
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
