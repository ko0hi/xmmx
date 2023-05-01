<script setup lang="ts">
import useOrderbookWebsocket from '~/composables/useOrderbookWebsocket'
import { computed } from 'vue'
import flatten from 'lodash/flatten'
import usePrecisionFormatter from '~/composables/usePrecisionFormatter'

const props = withDefaults(
  defineProps<{
    exchangeId: string
    symbol: string
    interval: number
    limit?: number
    round?: number
    exchangeOptions?: object
  }>(),
  {
    limit: 5,
    round: null,
    exchangeOptions: () => {},
  }
)

const { orderbook, pending } = useOrderbookWebsocket(props)
const { formatPrice, formatSize } = usePrecisionFormatter(props.exchangeId, props.exchangeOptions)

type Item = { value: string; side: 'ask' | 'bid'; kind: 'size' | 'price' }

const getIthRowItem = (i: number): [Item, Item, Item, Item] => {
  const ask = orderbook.value.asks[i]
  const bid = orderbook.value.bids[i]
  return [
    {
      value: formatSize(props.symbol, bid[1]),
      side: 'bid',
      kind: 'size',
    },
    {
      value: formatPrice(props.symbol, bid[0]),
      side: 'bid',
      kind: 'price',
    },
    {
      value: formatPrice(props.symbol, ask[0]),
      side: 'ask',
      kind: 'price',
    },
    {
      value: formatSize(props.symbol, ask[1]),
      side: 'ask',
      kind: 'size',
    },
  ]
}

const displayItems = computed(() => flatten([...new Array(props.limit).keys()].map(getIthRowItem)))
</script>

<template>
  <div v-if="!pending" class="grid grid-cols-4 font-mono text-right">
    <span>Size</span>
    <span>Bid</span>
    <span>Ask</span>
    <span>Size</span>
    <span
      v-for="item in displayItems"
      :key="item"
      class="hover hover:bg-gray-100 cursor-pointer"
      :class="item.side == 'ask' ? 'text-red-500' : 'text-green-500'"
    >
      {{ item.value }}
    </span>
  </div>
</template>

<style scoped></style>
