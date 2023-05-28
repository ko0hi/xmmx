<script setup lang="ts">
import { onMounted } from 'vue'
import useOrderbookList from '~/components/trading/useOrderbookList'

const { orderbookList, addOrderbook, deleteOrderbook, saveCurrentList, initWithPreset } = useOrderbookList()

onMounted(() => {
  ;[
    { exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' },
    { exchangeId: 'binancecoinm', symbol: 'BTC/USD:BTC' },
    { exchangeId: 'binancecoinm', symbol: 'BTC/USD:BTC-230630' },
    { exchangeId: 'binanceusdm', symbol: 'ETH/USDT:USDT' },
    { exchangeId: 'binancecoinm', symbol: 'ETH/USD:ETH' },
    { exchangeId: 'binancecoinm', symbol: 'ETH/USD:ETH-230630' },
  ].map(addOrderbook)
})

onMounted(() => addOrderbook())
</script>

<template>
  <div>
    <preferences-orderbook-presets-tab @click-preset="initWithPreset" @save-orderbooks="saveCurrentList" />
    <div class="flex flex-wrap gap-5">
      <div v-for="[index, orderbook] in Object.entries(orderbookList)" :key="orderbook.key">
        <div class="flex justify-end m-0 p-0">
          <n-button quaternary circle size="small" @click="deleteOrderbook(orderbook.key)">
            <span v-if="index > 0" class="text-xs">✖</span>
          </n-button>
        </div>
        <component
          :is="orderbook.component"
          class="-mt-1"
          :exchange-id="orderbook?.props?.exchangeId"
          :symbol="orderbook?.props?.symbol"
        />
      </div>
      <div class="flex m-5 items-center justify-center">
        <n-button class="h-full" size="small" circle @click="addOrderbook">+</n-button>
      </div>
    </div>

    <n-button @click="saveCurrentList"></n-button>
    <n-button @click="initWithPreset('b')">init</n-button>
  </div>
</template>

<style scoped></style>
