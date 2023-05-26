<script setup lang="ts">
import { OrderParams } from '~/utils/ccxt/types'
import useCurrencyIcon from '~/composables/useCurrencyIcon'
const props = defineProps<{ exchangeId: string; params: OrderParams }>()

const { iconPath } = useCurrencyIcon(props.params.symbol)
</script>

<template>
  <div class="grid grid-cols-2 m-2 p-2">
    <span>Exchange</span>
    <span>{{ props.exchangeId }}</span>
    <span>Symbol</span>
    <div class="flex items-center gap-2">
      <img class="w-5" :src="iconPath" alt="symbol" />
      <span>{{ props.params.symbol }}</span>
    </div>
    <span>Side</span>
    <span :class="props.params.side === 'buy' ? 'text-green-500' : 'text-red-500'">{{ props.params.side }}</span>
    <span>Type</span>
    <span>{{ props.params.type }}</span>
    <span>Size</span>
    <span>{{ props.params.amount }}</span>
    <span>Price</span>
    <span>{{ props.params.price }}</span>
    <span v-if="props.params.triggerPrice">Trigger</span>
    <span v-if="props.params.triggerPrice">{{ props.params.triggerPrice }}</span>
    <span>Reduce Only</span>
    <span>{{ props.params.reduceOnly ? 'Yes' : 'No' }} </span>
    <span>Post Only</span>
    <span>{{ props.params.postOnly ? 'Yes' : 'No' }}</span>
  </div>
</template>

<style scoped></style>
