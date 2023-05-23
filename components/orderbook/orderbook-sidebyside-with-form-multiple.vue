<script setup lang="ts">
import { OrderbookSidebysideWithForm } from '#components'

const orderbookComponent = shallowRef(OrderbookSidebysideWithForm)
const orderbookList = ref([])

onMounted(() => {
  const defaults = [
    { exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' },
    { exchangeId: 'binancecoinm', symbol: 'BTC/USD:BTC' },
    { exchangeId: 'binancecoinm', symbol: 'BTC/USD:BTC-230630' },
    { exchangeId: 'binancecoinm', symbol: 'BTC/USD:BTC-230929' },
    { exchangeId: 'binanceusdm', symbol: 'ETH/USDT:USDT' },
    { exchangeId: 'binancecoinm', symbol: 'ETH/USD:ETH' },
    { exchangeId: 'binancecoinm', symbol: 'ETH/USD:ETH-230630' },
    { exchangeId: 'binancecoinm', symbol: 'ETH/USD:ETH-230929' },
  ]

  defaults.map(d => {
    orderbookList.value.push({ component: orderbookComponent, key: new Date().getTime(), props: d })
  })
})

const addOrderbook = () => {
  orderbookList.value.push({ component: orderbookComponent, key: new Date().getTime() })
}

const onDeleteButtonClick = key => {
  orderbookList.value = orderbookList.value.filter(item => item.key !== key)
}

onMounted(() => addOrderbook())
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-5">
      <div v-for="[index, orderbook] in Object.entries(orderbookList)" :key="orderbook.key">
        <div class="flex justify-end m-0 p-0">
          <n-button quaternary circle size="small" @click="onDeleteButtonClick(orderbook.key)">
            <span v-if="index > 0" class="text-xs">✖</span>
          </n-button>
        </div>
        <component
          :is="orderbook.component"
          class="-mt-1"
          :exchangeId="orderbook?.props?.exchangeId"
          :symbol="orderbook?.props?.symbol"
        />
      </div>
      <div class="flex m-5 items-center justify-center">
        <n-button class="h-full" size="small" circle @click="addOrderbook">+</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
