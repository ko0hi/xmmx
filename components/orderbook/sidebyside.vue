<script setup lang="ts">
import useOrderbookWebsocket from '~/composables/useOrderbookWebsocket'
import { computed, Ref } from 'vue'
import flatten from 'lodash/flatten'
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

const displayItems = computed(() =>
  flatten([...new Array(Math.min(props.limit, orderbook.value.asks.length)).keys()].map(getIthRowItem))
)

const emit = defineEmits<{
  (event: 'update:clicked', value: { exchangeId: string; exchangeOptions: object; symbol: string }): void
}>()

const onClick = (item: Item) => {
  emit('update:clicked', {
    exchangeId: props.exchangeId,
    exchangeOptions: props.exchangeOptions || {},
    symbol: props.symbol,
    ...item,
  })
  console.log('Clicked', item, props.clicked)
}
</script>

<template>
  <div class="flex justify-center items-center min-h-[6rem]">
    <div v-if="!pending" class="grid grid-cols-4 gap-x-2 font-mono text-right w-full">
      <span>Size</span>
      <span>Bid</span>
      <span>Ask</span>
      <span>Size</span>
      <span
        v-for="item in displayItems"
        :key="item"
        class="hover hover:bg-gray-100 cursor-pointer"
        :class="item.side == 'ask' ? 'text-red-500' : 'text-green-500'"
        @click="onClick(item)"
      >
        {{ item.value }}
      </span>
    </div>
    <div v-else>
      <progress class="progress progress-primary w-56"></progress>
    </div>
  </div>
</template>

<style scoped></style>
