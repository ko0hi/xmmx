import { ComputedRef, onMounted, onUnmounted, type Ref, ref, readonly } from 'vue'
import { type OrderBook } from 'ccxt'
import { castToRef } from '~/utils/vue/cast'

interface Options {
  limit?: number | Ref<number>
  round?: number | Ref<number>
  exchangeOptions?: object | Ref<object>
}

type OrderBookWithSymbol = OrderBook & { symbol: string }

const emptyOrderbook: OrderBookWithSymbol = {
  asks: [],
  bids: [],
  symbol: '',
  timestamp: 0,
  datetime: '',
  nonce: 0,
}

const useOrderbookWebsocket = (
  exchangeId: string | ComputedRef<string>,
  symbol: string | ComputedRef<string>,
  interval: number | ComputedRef<number>,
  options: Options
): {
  orderbook: Readonly<
    Ref<{
      readonly asks: readonly (readonly [number, number])[]
      readonly bids: readonly (readonly [number, number])[]
      readonly datetime: string
      readonly timestamp: number
      readonly nonce: number
      readonly symbol: string
    }>
  >
  pending: Readonly<Ref<boolean>>
} => {
  const symbolRef = castToRef(symbol)
  const intervalRef = castToRef(interval)
  const limitRef = castToRef(options.limit ?? 50)
  const roundRef = castToRef(options.round ?? null)

  const orderbook = ref<OrderBookWithSymbol>(emptyOrderbook)
  const pending = ref(true)

  // @ts-expect-error('nodejs')
  const timer = ref<Timer>(null)

  const { exchangeIdRef, exchangeOptionsRef, client } = useCcxtClient(exchangeId, options.exchangeOptions)

  const updateOrderbook = async () => {
    const newOrderbook = client.value.getOrderbookFromSocket(symbolRef.value)
    orderbook.value = {
      asks: roundOrderbook(newOrderbook.asks, 'ask').slice(0, limitRef.value),
      bids: roundOrderbook(newOrderbook.bids, 'bid').slice(0, limitRef.value),
      datetime: newOrderbook.datetime,
      timestamp: newOrderbook.timestamp,
      nonce: newOrderbook.nonce,
      symbol: symbolRef.value,
    }
  }

  const roundOrderbook = (priceSizes: Array<[number, number]>, side: 'ask' | 'bid'): Array<[number, number]> => {
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
      return Object.entries(aggregatedData)
        .map(([price, quantity]) => [parseFloat(price), quantity])
        .sort((a, b) => (side === 'ask' ? a[0] - b[0] : b[0] - a[0]))
        .map(([price, quantity]) => [price, quantity])
    }
  }

  const start = async (): Promise<void> => {
    pending.value = true

    await client.value.watchOrderbook({ symbol: symbolRef.value })
    await updateOrderbook()
    timer.value = setInterval(updateOrderbook, intervalRef.value)

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

  onMounted(start)
  onUnmounted(stop)
  watch([exchangeIdRef, symbolRef, intervalRef, exchangeOptionsRef], init)

  return { orderbook: readonly(orderbook), pending: readonly(pending) }
}

export default useOrderbookWebsocket
