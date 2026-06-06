export interface IcebergConfig {
  maxRandomOffset: number
}

export interface IcebergLevel {
  title: string
  items: string[]
}

export interface IcebergResult {
  levels: IcebergLevel[]
  config: IcebergConfig
}

const defaultConfig = {
  maxRandomOffset: 10
}

const IcebergParser = (icebergLanguageText: string): IcebergResult => {
  const rows = icebergLanguageText.split("\n");
  const levels: Array<{ title: string; items: string[] }> = [];
  const config = { ...defaultConfig }
  let currentRowIndex: number = 0

  for (const row of rows) {
    const isRowEmpty = row.trim() == ''
    if (isRowEmpty) continue

    if (row.startsWith("max_random_offset")) {
      const value = row.split("=")[1]?.trim()
      if (value !== undefined) {
        config.maxRandomOffset = parseFloat(value)
      }
      continue
    }

    if (row.startsWith("level ")) {
      const rowTitle = detectLevelName(row);

      levels.push({ title: rowTitle, items: [] });
      currentRowIndex = levels.length - 1

      continue;
    }

    if (row.startsWith("  ")) {
      levels[currentRowIndex]?.items.push(row.trim())
    }
  }

  return { levels, config }
};

const detectLevelName = (text: string) => {
  return text.replace(/^level\s+/i, "")
    .replaceAll('"', "")
    .trim();
}

export default IcebergParser;
