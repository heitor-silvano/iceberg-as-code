import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { IcebergParser } from '../lib/iceberg/parser'
import type { IcebergResult } from '../lib/iceberg/types'
import { toPng } from 'html-to-image'

const DEFAULT_CODE = `max_random_offset = 10

level "First Level"
  Google
  Youtube
  Facebook
  Instagram
  Twitter

level "Second Level"
  Reddit
  Myspace
  Orkut
  Dailymotion

level "Third Level"
  4chan
  Liveleak
`

const STORAGE_KEY = 'iceberg_code_content'
const SPLIT_KEY = 'iceberg_split_ratio'

const code = ref<string>(DEFAULT_CODE)
const isDirty = ref<boolean>(false)
const isLiveSyncing = ref<boolean>(false)
const editorFontSize = ref<string>('13px')
const previewZoom = ref<number>(100)
const previewFont = ref<'sans' | 'mono'>('sans')
const textAlpha = ref<boolean>(false)
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
      isLiveSyncing.value = true
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, newVal)
          isDirty.value = false
        } finally {
          setTimeout(() => {
            isLiveSyncing.value = false
          }, 300)
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

  const insertLevel = () => {
    insertSnippet(`\n\nlevel "New Level"\n  Item 1\n  Item 2\n`)
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
      link.download = 'untitled-tier-list.png'
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
    ast,
    isDirty,
    isLiveSyncing,
    editorFontSize,
    previewZoom,
    previewFont,
    textAlpha,
    textStroke,
    splitRatio,
    isExporting,
    setMonacoInstance,
    insertLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    exportToPng,
  }
}
