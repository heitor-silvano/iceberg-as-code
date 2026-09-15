<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useIceberg } from '~/composables/useIceberg'
import {
  ICEBERG_LANGUAGE_ID,
  ICEBERG_THEME_ID,
  icebergLanguageDefinition,
  icebergThemeDefinition,
} from '~/lib/iceberg/monarch'

const {
  code,
  editorFontSize,
  editorWrap,
  setMonacoInstance,
} = useIceberg()

const containerRef = ref<HTMLDivElement | null>(null)
const isInitialized = ref(false)
let editor: any = null
let isProgrammaticUpdate = false

const numericFontSize = computed(() => {
  const parsed = parseInt(editorFontSize.value, 10)
  return isNaN(parsed) ? 13 : parsed
})

onMounted(async () => {
  if (!containerRef.value) return

  try {
    const monaco = await useMonaco()

    const existingLangs = monaco.languages.getLanguages()
    if (!existingLangs.some((l: any) => l.id === ICEBERG_LANGUAGE_ID)) {
      monaco.languages.register({ id: ICEBERG_LANGUAGE_ID })
      monaco.languages.setMonarchTokensProvider(
        ICEBERG_LANGUAGE_ID,
        icebergLanguageDefinition
      )
    }

    monaco.editor.defineTheme(ICEBERG_THEME_ID, icebergThemeDefinition)

    editor = monaco.editor.create(containerRef.value, {
      value: code.value,
      language: ICEBERG_LANGUAGE_ID,
      theme: ICEBERG_THEME_ID,
      fontSize: numericFontSize.value,
      wordWrap: editorWrap.value,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      lineNumbersMinChars: 3,
      glyphMargin: false,
      folding: true,
      renderLineHighlight: 'line',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    })

    setMonacoInstance(editor)
    isInitialized.value = true

    editor.onDidChangeModelContent(() => {
      if (isProgrammaticUpdate) return
      const val = editor.getValue()
      if (code.value !== val) {
        code.value = val
      }
    })
  } catch (err) {
    console.error('Erro ao inicializar Monaco Editor:', err)
  }
})

watch(numericFontSize, (newSize) => {
  editor?.updateOptions({ fontSize: newSize })
})

watch(editorWrap, (newWrap) => {
  editor?.updateOptions({ wordWrap: newWrap })
})

watch(code, (newVal) => {
  if (!editor) return
  const currentVal = editor.getValue()
  if (currentVal !== newVal) {
    isProgrammaticUpdate = true
    const position = editor.getPosition()
    editor.setValue(newVal)
    if (position) {
      editor.setPosition(position)
    }
    isProgrammaticUpdate = false
  }
})

onBeforeUnmount(() => {
  editor?.dispose()
  editor = null
})
</script>

<template>
  <div class="w-full h-full relative bg-zinc-900 overflow-hidden">
    <div
      v-show="!isInitialized"
      class="flex items-center justify-center h-full text-zinc-500 text-xs"
    >
      Carregando editor...
    </div>

    <div
      ref="containerRef"
      class="w-full h-full"
      :class="{ invisible: !isInitialized }"
    />
  </div>
</template>

