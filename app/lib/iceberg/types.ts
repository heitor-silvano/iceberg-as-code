export interface IcebergConfig {
  maxRandomOffset: number
}

export interface IcebergLevel {
  id: string
  index: number
  levelNumber: number
  title: string
  zone: string
  depth?: string
  color: string
  items: string[]
}

export interface IcebergResult {
  levels: IcebergLevel[]
  config: IcebergConfig
  totalLevels: number
  totalEntries: number
  lineCount: number
  isValid: boolean
  error?: string
  errorLine?: number
}
