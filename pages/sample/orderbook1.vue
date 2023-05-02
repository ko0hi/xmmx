<template>
  <div class="flex flex-col w-1/2 gap-y-4 m-5 items-center">
    <p>Naive-UI</p>
    <orderbook-sidebyside-with-form
      v-model="config"
      :exchange-id="exchange"
      :symbol="selected"
      :interval="interval"
      :limit="limit"
      :round="round"
    />
    <p>{{ config }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const exchange = ref('binanceusdm')
const selected = ref('BTC/USDT:USDT')
const interval = ref(1000)
const limit = ref(5)
const round = ref(null)

const config = ref()
</script>
