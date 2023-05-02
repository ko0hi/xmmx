import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import createClient from '../utils/ccxt'
import { type OrderBook } from 'ccxt'
import { castToRef } from '~/utils/vue/cast'

interface Options {
  limit?: number
  round?: number
  exchangeOptions?: object
}

const emptyOrderbook = {
  asks: [],
  bids: [],
  symbol: '',
  timestamp: 0,
  datetime: '',
  nonce: 0,
}

const useOrderbookWebsocket = (
  exchangeId: string | Ref<string>,
  symbol: string | Ref<string>,
  interval: number | Ref<number>,
  options: Options | Ref<Options>
): {
  orderbook: Ref<OrderBook>
  pending: Ref<boolean>
} => {
  const exchangeIdRef = castToRef(exchangeId)
  const symbolRef = castToRef(symbol)
  const intervalRef = castToRef(interval)
  const optionsRef = castToRef({
    ...{
      limit: 50,
      round: null,
      exchangeOptions: {},
    },
    ...(isRef(options) ? options.value : options),
  })

  const orderbook = ref<OrderBook & { symbol: string }>(emptyOrderbook)
  const pending = ref(true)
  // @ts-expect-error('nodejs')
  const timer = ref<Timer>(null)

  const client = computed(() => createClient(exchangeIdRef.value, optionsRef.value?.exchangeOptions))

  onMounted(async () => {
    await start()
  })
  onUnmounted(() => {
    stop()
  })
  const watchOrderbook = async (): Promise<void> => {
    await client.value.watchOrderbook({ symbol: symbolRef.value })
    updateOrderbook(client.value.getOrderbookFromSocket(symbolRef.value))
    pending.value = false

    timer.value = setInterval(() => {
      updateOrderbook(client.value.getOrderbookFromSocket(symbolRef.value))
    }, intervalRef.value)
  }

  const updateOrderbook = (newOrderbook: OrderBook): void => {
    const limit = optionsRef.value?.limit
    orderbook.value = {
      asks: roundOrderbook(newOrderbook.asks).slice(0, limit),
      bids: roundOrderbook(newOrderbook.bids).slice(0, limit),
      datetime: newOrderbook.datetime,
      timestamp: newOrderbook.timestamp,
      nonce: newOrderbook.nonce,
      symbol: symbolRef.value,
    }
  }

  const roundOrderbook = (priceSizes: Array<[number, number]>): Array<[number, number]> => {
    const aggregatedData: Record<number, number> = {}
    const round = optionsRef.value?.round
    if (round === null) {
      return priceSizes
    } else {
      for (const [price, quantity] of priceSizes) {
        const roundedPrice = Math.round(price / round) * round
        if (aggregatedData[roundedPrice] !== undefined) {
          aggregatedData[roundedPrice] += quantity
        } else {
          aggregatedData[roundedPrice] = quantity
        }
      }
      return Object.entries(aggregatedData).map(([price, quantity]) => [parseFloat(price), quantity])
    }
  }

  const start = async (): Promise<void> => {
    await watchOrderbook()
  }
  const stop = (): void => {
    clearInterval(timer.value)
  }

  const init = async (): Promise<void> => {
    stop()
    pending.value = true
    await start()
  }

  watch(symbolRef, async () => {
    await init()
  })

  return { orderbook, pending }
}

export default useOrderbookWebsocket
