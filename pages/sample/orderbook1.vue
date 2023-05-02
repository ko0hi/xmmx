<template>
  <div class="flex flex-col w-1/2 gap-y-4 m-5 items-center">
    <select-symbol v-model="selected" :exchange-id="exchange"></select-symbol>
    <sidebyside-orderbook :exchange-id="exchange" :symbol="selected" :interval="100" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SidebysideOrderbook from '~/components/sidebyside-orderbook.vue'
import SelectSymbol from '~/components/select-symbol.vue'

const exchange = ref('binanceusdm')
const selected = ref('BTC/USDT:USDT')
</script>
