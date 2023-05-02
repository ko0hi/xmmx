import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import { type OrderBook } from 'ccxt'
import createClient from '~/utils/ccxt'
import { castToRef } from '~/utils/vue/cast'

interface Options {
  limit?: number | Ref<number>
  round?: number | Ref<number>
  exchangeOptions?: object | Ref<object>
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
  options: Options
): {
  orderbook: Ref<OrderBook>
  pending: Ref<boolean>
} => {
  const exchangeIdRef = castToRef(exchangeId)
  const symbolRef = castToRef(symbol)
  const intervalRef = castToRef(interval)
  const limitRef = castToRef(options.limit ?? 50)
  const roundRef = castToRef(options.round ?? null)
  const exchangeOptionsRef = castToRef(options.exchangeOptions ?? {})

  const orderbook = ref<OrderBook & { symbol: string }>(emptyOrderbook)
  const pending = ref(true)
  // @ts-expect-error('nodejs')
  const timer = ref<Timer>(null)

  const client = computed(() => createClient(exchangeIdRef.value, exchangeOptionsRef.value))

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
    orderbook.value = {
      asks: roundOrderbook(newOrderbook.asks).slice(0, limitRef.value),
      bids: roundOrderbook(newOrderbook.bids).slice(0, limitRef.value),
      datetime: newOrderbook.datetime,
      timestamp: newOrderbook.timestamp,
      nonce: newOrderbook.nonce,
      symbol: symbolRef.value,
    }
  }

  const roundOrderbook = (priceSizes: Array<[number, number]>): Array<[number, number]> => {
    const aggregatedData: Record<number, number> = {}
    const round = roundRef.value
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
    pending.value = true
    await watchOrderbook()
    pending.value = false
  }
  const stop = (): void => {
    pending.value = true
    clearInterval(timer.value)
  }

  const init = async (): Promise<void> => {
    stop()
    await start()
  }

  watch([exchangeIdRef, symbolRef, intervalRef, exchangeOptionsRef], async () => {
    await init()
  })

  return { orderbook, pending }
}

export default useOrderbookWebsocket
