<template>
  <MonacoEditor v-model="value" lang="markdown" :style="{ width: '100%', height: '200px' }" :options="{ theme: 'vs-dark' }"/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref('')
</script>
