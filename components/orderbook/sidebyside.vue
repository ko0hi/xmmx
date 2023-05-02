<script setup lang="ts">
import useOrderbookWebsocket from '~/composables/useOrderbookWebsocket'
import { computed, Ref } from 'vue'
import usePrecisionFormatter from '~/composables/usePrecisionFormatter'

type OrderbookProps = {
  exchangeId: string
  symbol: string
  interval: number
  limit?: number
  round?: number
  exchangeOptions?: object
  clicked?: Ref<object> | null
}
type Item = { i: number; side: 'ask' | 'bid'; price: string; size: string; sizeDisplay: string }

const props = withDefaults(defineProps<OrderbookProps>(), {
  limit: 5,
  round: null,
  exchangeOptions: () => {},
  clicked: null,
})

const { orderbook, pending } = useOrderbookWebsocket(
  computed(() => props.exchangeId),
  computed(() => props.symbol),
  computed(() => props.interval),
  {
    limit: computed(() => props.limit),
    round: computed(() => props.round),
    exchangeOptions: computed(() => props.exchangeOptions),
  }
)
const { formatPrice, formatSize } = usePrecisionFormatter(
  computed(() => props.exchangeId),
  computed(() => props.exchangeOptions)
)

const getIthRowItem = (i: number, side: 'ask' | 'bid'): Item => {
  const target = side === 'ask' ? orderbook.value.asks[i] : orderbook.value.bids[i]
  return {
    i: i,
    side: side,
    price: formatPrice(props.symbol, target[0]),
    size: formatSize(props.symbol, target[1]),
    sizeDisplay: formatSize(props.symbol, target[1], true),
  }
}

const sideToSpanClass = (side: 'ask' | 'bid') => (side === 'ask' ? 'text-red-500' : 'text-green-500')
const onClick = (item: Item) => {
  emit('update:clicked', {
    exchangeId: props.exchangeId,
    exchangeOptions: props.exchangeOptions || {},
    symbol: props.symbol,
    ...item,
  })
}

const displayItems = computed<Item[]>(() => {
  const rtn = []
  for (let i = 0; i < Math.min(orderbook.value.asks.length, props.limit); ++i) {
    for (const side of ['bid', 'ask']) {
      rtn.push(getIthRowItem(i, side))
    }
  }
  return rtn
})

const emit = defineEmits<{
  (event: 'update:clicked', value: { exchangeId: string; exchangeOptions: object; symbol: string }): void
}>()
</script>

<template>
  <div class="flex justify-center items-center min-h-[6rem]">
    <div v-if="!pending" class="grid grid-cols-2 gap-x-2 font-mono text-right w-full">
      <div class="grid grid-cols-2">
        <span>Size</span>
        <span>Bid</span>
      </div>
      <div class="grid grid-cols-2">
        <span>Ask</span>
        <span>Size</span>
      </div>
      <div
        v-for="item in displayItems"
        :key="item"
        class="grid grid-cols-2 hover hover:bg-gray-100 cursor-pointer"
        @click="onClick(item)"
      >
        <span :class="sideToSpanClass(item.side)">{{ item.side === 'bid' ? item.sizeDisplay : item.price }}</span>
        <span :class="sideToSpanClass(item.side)">{{ item.side == 'bid' ? item.price : item.sizeDisplay }}</span>
      </div>
    </div>
    <div v-else>
      <progress class="progress progress-primary w-56"></progress>
    </div>
  </div>
</template>
