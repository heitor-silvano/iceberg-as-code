import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { IcebergParser } from '../lib/iceberg/parser'
import type { IcebergResult } from '../lib/iceberg/types'
import { toPng } from 'html-to-image'

const DEFAULT_CODE = `settings: {
  title: "untitled-1";
  background_alpha: 95;
  font: "sans";
}

tier "First Tier"
  Item 1
  Item 2
`

const STORAGE_KEY = 'iceberg_code_content'
const TABS_KEY = 'iceberg_tabs'
const ACTIVE_TAB_KEY = 'iceberg_active_tab'
const SPLIT_KEY = 'iceberg_split_ratio'

export interface Tab {
  id: string
  code: string
}

const tabs = ref<Tab[]>([{ id: 'tab-1', code: DEFAULT_CODE }])
const activeTabId = ref<string>('tab-1')
const dirtyMap = ref<Record<string, boolean>>({})

const code = computed({
  get: () => {
    const t = tabs.value.find(t => t.id === activeTabId.value)
    return t ? t.code : ''
  },
  set: (val: string) => {
    const t = tabs.value.find(t => t.id === activeTabId.value)
    if (t) {
      t.code = val
      dirtyMap.value[t.id] = true
    } else if (tabs.value.length === 0) {
      tabs.value.push({ id: 'tab-1', code: val })
      activeTabId.value = 'tab-1'
      dirtyMap.value['tab-1'] = true
    }
  }
})

const isDirty = computed({
  get: () => !!dirtyMap.value[activeTabId.value],
  set: (val: boolean) => {
    dirtyMap.value[activeTabId.value] = val
  }
})

const editorFontSize = ref<string>('13px')
const previewZoom = ref<number>(100)
const textStroke = ref<boolean>(false)
const splitRatio = ref<number>(50)
const isExporting = ref<boolean>(false)

let monacoEditorInstance: any = null
let isInitialized = false

export function resetStorageForTest() {
  isInitialized = false
  tabs.value = [{ id: 'tab-1', code: DEFAULT_CODE }]
  activeTabId.value = 'tab-1'
  dirtyMap.value = {}
}

function initStorage() {
  if (typeof window === 'undefined' || isInitialized) return
  isInitialized = true

  const savedTabsStr = localStorage.getItem(TABS_KEY)
  const savedActive = localStorage.getItem(ACTIVE_TAB_KEY)
  
  if (savedTabsStr) {
    try {
      const parsed = JSON.parse(savedTabsStr)
      if (Array.isArray(parsed) && parsed.length > 0) {
        tabs.value = parsed
        activeTabId.value = savedActive && parsed.some((t: Tab) => t.id === savedActive) 
          ? savedActive 
          : parsed[0].id
      }
    } catch {
    }
  } else {
    const savedCode = localStorage.getItem(STORAGE_KEY)
    if (savedCode !== null && savedCode.trim() !== '') {
      tabs.value = [{ id: 'tab-1', code: savedCode }]
      activeTabId.value = 'tab-1'
    }
  }

  const savedSplit = localStorage.getItem(SPLIT_KEY)
  if (savedSplit) {
    const parsed = parseFloat(savedSplit)
    if (!isNaN(parsed) && parsed >= 20 && parsed <= 80) {
      splitRatio.value = parsed
    }
  }

  let saveTimer: any = null
  watch(() => tabs.value, (newTabs) => {
    if (typeof window !== 'undefined') {
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(TABS_KEY, JSON.stringify(newTabs))
          localStorage.setItem(ACTIVE_TAB_KEY, activeTabId.value)
          newTabs.forEach(t => { dirtyMap.value[t.id] = false })
          const active = newTabs.find(t => t.id === activeTabId.value)
          if (active) localStorage.setItem(STORAGE_KEY, active.code)
        } catch (e) {
        }
      }, 500)
    }
  }, { deep: true })
  
  watch(activeTabId, (newId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_TAB_KEY, newId)
      const active = tabs.value.find(t => t.id === newId)
      if (active) localStorage.setItem(STORAGE_KEY, active.code)
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
      if (/^iceberg_title:.*$/m.test(currentCode)) {
        currentCode = currentCode.replace(/^iceberg_title:.*$/m, '')
      }
      currentCode = `settings: {\n  ${key}: ${value};\n}\n\n` + currentCode.trimStart()
    }
    code.value = currentCode
  }

  const filename = computed({
    get() {
      return ast.value.config.title || 'untitled-1'
    },
    set(newVal) {
      const sanitized = newVal.trim() || 'untitled-1'
      updateSettingInCode('title', `"${sanitized}"`)
    }
  })

  const getFilenameForTab = (tabCode: string) => {
    const tmpAst = IcebergParser(tabCode)
    return tmpAst.config.title || 'untitled'
  }

  const addTab = () => {
    const existingTitles = tabs.value.map(t => getFilenameForTab(t.code))
    let nextNum = 1
    while (existingTitles.includes(`untitled-${nextNum}`)) {
      nextNum++
    }
    const newId = 'tab-' + Date.now() + Math.random().toString(36).substr(2, 5)
    tabs.value.push({
      id: newId,
      code: `settings: {
  title: "untitled-${nextNum}";
  background_alpha: 95;
  font: "sans";
}

tier "New Tier"
  Item 1
`
    })
    activeTabId.value = newId
  }

  const closeTab = (id: string) => {
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tabs.value.splice(idx, 1)
      if (tabs.value.length === 0) {
        addTab()
      } else if (activeTabId.value === id) {
        activeTabId.value = tabs.value[Math.max(0, idx - 1)]?.id || ''
      }
    }
  }

  const reorderTabs = (newTabs: Tab[]) => {
    tabs.value = newTabs
  }

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
      const sanitizedName = filename.value.trim() || 'untitled-1'
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
    tabs,
    activeTabId,
    addTab,
    closeTab,
    reorderTabs,
    getFilenameForTab,
    code,
    filename,
    ast,
    isDirty,
    dirtyMap,
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
