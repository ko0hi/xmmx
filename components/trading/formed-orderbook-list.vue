<script setup lang="ts">
import { onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useOrderbookList from '~/components/trading/useOrderbookList'

const {
  orderbookList,
  addOrderbook,
  deleteOrderbook,
  deleteAllOrderbooks,
  reloadAllOrderbooks,
  saveCurrentList,
  initWithPreset,
} = useOrderbookList()

onMounted(() => {
  [
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
    <preferences-orderbook-presets-tab class="mb-0" @click-preset="initWithPreset" @save-orderbooks="saveCurrentList" />
    <div class="border border-green-600 w-full">
      <div class="flex justify-end bg-opacity-50 gap-2 p-2">
        <font-awesome-icon
          class="cursor-pointer text-gray-200 hover:text-gray-500 text-md"
          :icon="['fas', 'arrows-rotate']"
          @click="reloadAllOrderbooks"
        />
        <font-awesome-icon
          class="cursor-pointer text-gray-200 hover:text-gray-500 text-md"
          :icon="['fas', 'trash']"
          @click="deleteAllOrderbooks"
        />
      </div>
      <div class="flex flex-wrap gap-5">
        <div v-for="[index, orderbook] in Object.entries(orderbookList)" :key="orderbook.key">
          <div class="flex gap-2 justify-end items-center p-0 h-5">
            <font-awesome-icon
              v-if="index > 0"
              class="cursor-pointer text-gray-200 hover:text-gray-500 text-xs"
              :icon="['fas', 'trash']"
              @click="deleteOrderbook(orderbook.key)"
            />
          </div>
          <component :is="orderbook.component" v-model:config="orderbook.config" class="-mt-1" />
        </div>
        <div class="flex m-5 items-center justify-center">
          <n-button
            class="h-full"
            size="small"
            circle
            @click="addOrderbook({ exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' })"
            >+</n-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
