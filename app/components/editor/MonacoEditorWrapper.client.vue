<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
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

const isInitialized = ref(false)
const monacoRef = ref<any>(null)

const numericFontSize = computed(() => {
  const parsed = parseInt(editorFontSize.value, 10)
  return isNaN(parsed) ? 13 : parsed
})

const editorOptions = computed(() => ({
  theme: ICEBERG_THEME_ID,
  fontSize: numericFontSize.value,
  wordWrap: editorWrap.value,
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  lineNumbers: 'on' as const,
  lineNumbersMinChars: 3,
  glyphMargin: false,
  folding: true,
  renderLineHighlight: 'line' as const,
  cursorBlinking: 'smooth' as const,
  cursorSmoothCaretAnimation: 'on' as const,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}))

onMounted(async () => {
  try {
    const monaco = await useMonaco()
    monacoRef.value = monaco

    const existingLangs = monaco.languages.getLanguages()
    if (!existingLangs.some((l: any) => l.id === ICEBERG_LANGUAGE_ID)) {
      monaco.languages.register({ id: ICEBERG_LANGUAGE_ID })
      monaco.languages.setMonarchTokensProvider(
        ICEBERG_LANGUAGE_ID,
        icebergLanguageDefinition
      )
    }

    monaco.editor.defineTheme(ICEBERG_THEME_ID, icebergThemeDefinition)
    isInitialized.value = true
  } catch (err) {
    console.error('Erro ao registrar sintaxe iceberg no Monaco:', err)
  }
})

const onEditorLoad = (editor: any) => {
  setMonacoInstance(editor)
}
</script>

<template>
  <div class="w-full h-full relative bg-zinc-900 overflow-hidden">
    <div v-if="!isInitialized" class="flex items-center justify-center h-full text-zinc-500 text-xs">
      Carregando editor...
    </div>

    <MonacoEditor
      v-else
      v-model="code"
      :lang="ICEBERG_LANGUAGE_ID"
      :options="editorOptions"
      class="w-full h-full"
      @load="onEditorLoad"
    />
  </div>
</template>
