const IcebergParser = (icebergLanguageText: string) => {
  const rows = icebergLanguageText.split("\n");
  const levels: Array<{ title: string; items: string[] }> = [];
  let currentRowIndex: number = 0

  for (const row of rows) {
    const isRowEmpty = row.trim() == ''
    if (isRowEmpty) continue

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

  return levels
};

const detectLevelName = (text: string) => {
  return text.replace(/^level\s+/i, "")
    .replaceAll('"', "")
    .trim();
}

export default IcebergParser;
