import { onMounted, onUnmounted, readonly, ref, type Ref, watch } from 'vue'
import { castToRef } from '~/utils/vue/cast'
import { Socket } from 'socket.io-client'
import { OrderBook } from '~/utils/ccxt/types'
import useCcxtClient from '~/composables/useCcxtClient'

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
  exchangeId: string | Ref<string>,
  symbol: string | Ref<string>,
  interval: number | Ref<number>,
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

  const socket = ref<Socket>()

  // @ts-expect-error('nodejs')
  const timer = ref<Timer>(null)

  const { exchangeIdRef, client } = useCcxtClient(exchangeId)

  const updateOrderbook = async () => {
    const newOrderbook = client.value.getOrderbookFromSocket(symbolRef.value)
    if (newOrderbook) {
      orderbook.value = {
        asks: roundOrderbook(newOrderbook.asks, 'ask').slice(0, limitRef.value),
        bids: roundOrderbook(newOrderbook.bids, 'bid').slice(0, limitRef.value),
        datetime: newOrderbook.datetime,
        timestamp: newOrderbook.timestamp,
        nonce: newOrderbook.nonce,
        symbol: symbolRef.value,
      }
      pending.value = false
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
    socket.value = await client.value.watchOrderbook({ symbol: symbolRef.value })
    await updateOrderbook()
    timer.value = setInterval(updateOrderbook, intervalRef.value)
  }
  const stop = (): void => {
    pending.value = true
    socket.value?.disconnect()
    clearInterval(timer.value)
  }

  const init = async (): Promise<void> => {
    stop()
    await start()
  }

  onMounted(start)
  onUnmounted(stop)
  watch([exchangeIdRef, symbolRef, intervalRef], init)

  return { orderbook: readonly(orderbook), pending: readonly(pending) }
}

export default useOrderbookWebsocket
