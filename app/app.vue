<script lang="ts" setup>
import { ref } from 'vue'
import IcebergParser from './lib/iceberg/parser'
const text = `max_random_offset = 10

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

const source = ref(text)

const result = computed(() => IcebergParser(source.value))
const levels = computed(() => result.value.levels)
const config = computed(() => result.value.config)

</script>

<template>
  <MonacoEditor v-model="source" :levels="levels" lang="markdown" :style="{ width: '100%', height: '200px' }"
    :options="{ theme: 'vs-dark' }" />


  <Iceberg :levels="levels" :config="config" />

</template>