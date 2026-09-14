<script lang="ts" setup>
import { ref } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import TabBar from './components/layout/TabBar.vue'
import AppToolbar from './components/layout/AppToolbar.vue'
import SplitPane from './components/layout/SplitPane.vue'
import MonacoEditorWrapper from './components/editor/MonacoEditorWrapper.client.vue'
import EditorStatusBar from './components/editor/EditorStatusBar.vue'
import PreviewPanel from './components/preview/PreviewPanel.vue'
import { useIceberg } from './composables/useIceberg'

const { exportToPng } = useIceberg()
const previewPanelRef = ref<any>(null)

const handleExport = () => {
  if (previewPanelRef.value?.exportTarget) {
    exportToPng(previewPanelRef.value.exportTarget)
  }
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
        <AppHeader @export="handleExport" />

        <TabBar />

        <AppToolbar />

        <SplitPane class="flex-1">
            <template #left>
        <div class="h-full w-full flex flex-col bg-zinc-900 overflow-hidden">
          <div class="flex-1 min-h-0 relative">
            <MonacoEditorWrapper />
          </div>
          <EditorStatusBar />
        </div>
      </template>

            <template #right>
        <PreviewPanel ref="previewPanelRef" />
      </template>
    </SplitPane>
  </div>
</template>

<style>
/* Reset básico e estilos para scrollbar */
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}
</style>