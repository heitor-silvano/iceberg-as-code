import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { IcebergParser } from '../lib/iceberg/parser'
import type { IcebergResult } from '../lib/iceberg/types'
import { toPng } from 'html-to-image'

const DEFAULT_CODE = `settings: {
  title: "untitled-tier-list";
  background_alpha: 95;
  font: "sans";
}

tier "First Tier"
  Google
  Youtube
  Facebook
  Instagram
  Twitter

tier "Second Tier"
  Reddit
  Myspace
  Orkut
  Dailymotion

tier "Third Tier"
  4chan
  Liveleak
`

const STORAGE_KEY = 'iceberg_code_content'
const SPLIT_KEY = 'iceberg_split_ratio'

const code = ref<string>(DEFAULT_CODE)
const isDirty = ref<boolean>(false)
const editorFontSize = ref<string>('13px')
const previewZoom = ref<number>(100)
const textStroke = ref<boolean>(false)
const splitRatio = ref<number>(50)
const isExporting = ref<boolean>(false)

let monacoEditorInstance: any = null
let isInitialized = false

export function resetStorageForTest() {
  isInitialized = false
}

function initStorage() {
  if (typeof window === 'undefined' || isInitialized) return
  isInitialized = true

  const savedCode = localStorage.getItem(STORAGE_KEY)
  if (savedCode !== null && savedCode.trim() !== '') {
    code.value = savedCode
  }

  const savedSplit = localStorage.getItem(SPLIT_KEY)
  if (savedSplit) {
    const parsed = parseFloat(savedSplit)
    if (!isNaN(parsed) && parsed >= 20 && parsed <= 80) {
      splitRatio.value = parsed
    }
  }

  let saveTimer: any = null
  watch(code, (newVal) => {
    isDirty.value = true
    if (typeof window !== 'undefined') {
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, newVal)
          isDirty.value = false
        } catch (e) {
          // Ignore
        }
      }, 500)
    }
  })

  watch(splitRatio, (newVal) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SPLIT_KEY, newVal.toString())
    }
  })
}

export function useIceberg() {
  if (!isInitialized) {
    if (getCurrentInstance()) {
      onMounted(() => {
        initStorage()
      })
    } else {
      initStorage()
    }
  }

  const ast = computed<IcebergResult>(() => {
    return IcebergParser(code.value)
  })

  const updateSettingInCode = (key: string, value: string | number) => {
    let currentCode = code.value
    const settingsMatch = currentCode.match(/settings:\s*\{([^}]*)\}/)
    
    if (settingsMatch) {
      let content = settingsMatch[1] || ''
      const regex = new RegExp(`(${key}:\\s*)([^;\\n]+)`, 'i')
      if (regex.test(content)) {
        content = content.replace(regex, `$1${value}`)
      } else {
        content = content.replace(/\s*$/, `\n  ${key}: ${value};\n`)
      }
      currentCode = currentCode.replace(settingsMatch[0], `settings: {${content}}`)
    } else {
      // support removing old iceberg_title if it exists
      if (/^iceberg_title:.*$/m.test(currentCode)) {
        currentCode = currentCode.replace(/^iceberg_title:.*$/m, '')
      }
      currentCode = `settings: {\n  ${key}: ${value};\n}\n\n` + currentCode.trimStart()
    }
    code.value = currentCode
  }

  const filename = computed({
    get() {
      return ast.value.config.title || 'untitled-tier-list'
    },
    set(newVal) {
      const sanitized = newVal.trim() || 'untitled-tier-list'
      updateSettingInCode('title', `"${sanitized}"`)
    }
  })

  const previewFont = computed({
    get() {
      return ast.value.config.font || 'sans'
    },
    set(newVal) {
      updateSettingInCode('font', `"${newVal}"`)
    }
  })

  const textAlpha = computed({
    get() {
      return ast.value.config.backgroundAlpha ?? 95
    },
    set(newVal) {
      updateSettingInCode('background_alpha', newVal)
    }
  })

  const setMonacoInstance = (editor: any) => {
    monacoEditorInstance = editor
  }

  const insertSnippet = (snippet: string) => {
    if (monacoEditorInstance) {
      const selection = monacoEditorInstance.getSelection()
      if (selection) {
        monacoEditorInstance.executeEdits('toolbar-insert', [
          {
            range: selection,
            text: snippet,
            forceMoveMarkers: true,
          },
        ])
        monacoEditorInstance.focus()
        return
      }
    }

    code.value = code.value.trimEnd() + '\n\n' + snippet + '\n'
  }

  const insertTier = () => {
    insertSnippet(`\n\ntier "New Tier"\n  Item 1\n  Item 2\n`)
  }

  const zoomIn = () => {
    if (previewZoom.value < 200) {
      previewZoom.value = Math.min(200, previewZoom.value + 10)
    }
  }

  const zoomOut = () => {
    if (previewZoom.value > 40) {
      previewZoom.value = Math.max(40, previewZoom.value - 10)
    }
  }

  const resetZoom = () => {
    previewZoom.value = 100
  }

  const exportToPng = async (previewElement: HTMLElement | null) => {
    if (!previewElement || isExporting.value) return
    isExporting.value = true
    try {
      const dataUrl = await toPng(previewElement, {
        backgroundColor: '#bfe3f7',
        pixelRatio: 2,
        cacheBust: true,
        width: previewElement.scrollWidth,
        height: previewElement.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${previewElement.scrollWidth}px`,
          height: `${previewElement.scrollHeight}px`
        }
      })
      const link = document.createElement('a')
      const sanitizedName = filename.value.trim() || 'untitled-tier-list'
      link.download = `${sanitizedName}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Falha ao exportar PNG:', err)
    } finally {
      isExporting.value = false
    }
  }

  return {
    code,
    filename,
    ast,
    isDirty,
    editorFontSize,
    previewZoom,
    previewFont,
    textAlpha,
    textStroke,
    splitRatio,
    isExporting,
    setMonacoInstance,
    insertTier,
    zoomIn,
    zoomOut,
    resetZoom,
    exportToPng,
  }
}
