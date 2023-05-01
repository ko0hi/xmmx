import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import type Client from '../utils/ccxt/client'
import createClient from '../utils/ccxt'
import { type OrderBook } from 'ccxt'

const useOrderbookWebsocket = (options: {
  exchangeId: string
  symbol: string
  interval: number
  limit?: number
  round?: number
  exchangeOptions?: any
}): { orderbook: Ref<OrderBook>; pending: Ref<boolean> } => {
  const client = ref<Client>(createClient(options.exchangeId, options.exchangeOptions))
  const orderbook = ref<OrderBook & { symbol: string }>(null)
  const pending = ref(true)
  // @ts-expect-error('nodejs')
  const timer = ref<Timer>(null)

  const defaults = {
    limit: 50,
    round: null,
    exchangeOptions: {},
  }

  onMounted(async () => {
    await start()
  })
  onUnmounted(() => {
    stop()
  })
  const watchOrderbook = async (): Promise<void> => {
    const { symbol, interval } = { ...defaults, ...options }
    await client.value.watchOrderbook({ symbol })
    updateOrderbook(client.value.getOrderbookFromSocket(symbol))
    pending.value = false

    timer.value = setInterval(() => {
      updateOrderbook(client.value.getOrderbookFromSocket(symbol))
    }, interval)
  }

  const updateOrderbook = (newOrderbook: OrderBook): void => {
    const { symbol, limit } = { ...defaults, ...options }
    orderbook.value = {
      asks: roundOrderbook(newOrderbook.asks).slice(0, limit),
      bids: roundOrderbook(newOrderbook.bids).slice(0, limit),
      datetime: newOrderbook.datetime,
      timestamp: newOrderbook.timestamp,
      nonce: newOrderbook.nonce,
      symbol,
    }
  }

  const roundOrderbook = (priceSizes: Array<[number, number]>): Array<[number, number]> => {
    const aggregatedData: Record<number, number> = {}
    const { round } = { ...defaults, ...options }

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

  return { orderbook, pending }
}

export default useOrderbookWebsocket
