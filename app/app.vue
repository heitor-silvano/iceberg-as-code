<script lang="ts" setup>
import { ref } from 'vue'
import IcebergParser from './lib/iceberg/parser'
const text = `level "First Level"
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
const source = ref(text)
const icebergJson = ref()

const levels = computed(() => {
  icebergJson.value = IcebergParser(source.value)
})

</script>

<template>
  <MonacoEditor v-model="source" :levels="levels" lang="markdown" :style="{ width: '100%', height: '200px' }"
    :options="{ theme: 'vs-dark' }" />

    <div v-for="iceberg of icebergJson">
      {{ iceberg.title }}
      {{iceberg.items}}
    </div>

</template>