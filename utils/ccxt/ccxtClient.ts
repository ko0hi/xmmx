import type {
  Balances,
  CancelAllOrdersParams,
  CancelOrderParams,
  CancelOrdersParams,
  CreateOrderParams,
  EditOrderParams,
  FetchClosedOrdersParams,
  FetchMyTradesParams,
  FetchOHLCVParams,
  FetchOpenOrdersParams,
  FetchOrderbookParams,
  FetchOrderParams,
  FetchTickerParams,
  Market,
  OHLCV,
  Order,
  OrderBook,
  OrderParams,
  OrderState,
  Trade,
  WatchOrderbookParams,
  WatchTickerParams,
  WatchTradesParams,
} from './types'
import { io, Socket } from 'socket.io-client'
import { NotImplementedError } from '~/utils/exceptions'

import { useRuntimeConfig } from '#imports'

class CcxtClient {
  protected exchangeId: string
  protected ccxtServerUrl: string
  protected baseUrl: string
  private readonly orderState: OrderState
  private readonly orderHistory: Order[]
  private readonly orderbookCache: { [key: string]: OrderBook }

  constructor(exchangeId: string) {
    this.exchangeId = exchangeId
    this.ccxtServerUrl = useRuntimeConfig().public.ccxtServerUrl
    this.baseUrl = `${this.ccxtServerUrl}/api/${this.exchangeId}`
    this.orderState = {}
    this.orderHistory = []
    this.orderbookCache = {}
  }

  fetchMarkets = async (): Promise<Market[]> => {
    return await $fetch(`${this.baseUrl}/v1/markets`)
  }

  fetchTicker = async (params: FetchTickerParams): Promise<any> => {
    throw new NotImplementedError()
  }

  fetchOrderbook = async (params: FetchOrderbookParams): Promise<OrderBook> => {
    throw new NotImplementedError()
  }

  fetchOHLCV = async (params: FetchOHLCVParams): Promise<OHLCV[]> => {
    throw new NotImplementedError()
  }

  fetchBalance = async (): Promise<Balances> => {
    throw new NotImplementedError()
  }

  fetchOrder = async (params: FetchOrderParams): Promise<Order> => {
    throw new NotImplementedError()
  }

  fetchOpenOrders = async (params: FetchOpenOrdersParams | null = null): Promise<Order[]> => {
    return await $fetch(`${this.baseUrl}/v1/orders`, {
      method: 'GET',
      params: {
        exchangeId: this.exchangeId,
        symbol: params?.symbol,
      },
    })
  }

  fetchClosedOrders = async (params: FetchClosedOrdersParams): Promise<Order[]> => {
    throw new NotImplementedError()
  }

  fetchOrders = async (): Promise<Order[]> => {
    return await $fetch(`${this.baseUrl}/v1/orders`, {
      method: 'GET',
      params: {
        exchangeId: this.exchangeId,
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async order(params: OrderParams): Promise<Order> {
    if (params.type === 'limit' || params.type === 'market') {
      return await this.createOrder({
        symbol: params.symbol,
        type: params.type,
        side: params.side,
        amount: params.amount,
        price: params.price,
        params: params.params,
      })
    } else {
      throw new Error(`Not implemented order type: ${params.type}`)
    }
  }

  createOrder = async (params: CreateOrderParams): Promise<Order> => {
    const { symbol, type, side, amount, price } = params
    return await $fetch(`${this.baseUrl}/v1/createOrder`, {
      method: 'POST',
      body: {
        symbol,
        type,
        side,
        amount,
        price,
        ...params.params,
      },
    })
  }

  editOrder = async (params: EditOrderParams): Promise<Order> => {
    const { id, symbol, type, side, amount, price, params: extraParams } = params
    return await $fetch(`${this.baseUrl}/v1/editOrder`, {
      method: 'POST',
      body: {
        id: id,
        symbol: symbol,
        type: type,
        side: side,
        amount: amount,
        price: price,
      },
    })
  }

  cancelOrder = async (params: CancelOrderParams): Promise<Order> => {
    const { id, symbol, params: extraParams } = params
    return await $fetch(`${this.baseUrl}/v1/cancelOrder`, {
      method: 'POST',
      body: {
        id,
        symbol,
      },
    })
  }

  cancelOrders = async (params: CancelOrdersParams): Promise<Order[]> => {
    throw new NotImplementedError()
  }

  cancelAllOrders = async (params: CancelAllOrdersParams): Promise<boolean> => {
    throw new NotImplementedError()
  }

  fetchMyTrades = async (params: FetchMyTradesParams): Promise<Trade[]> => {
    throw new NotImplementedError()
  }

  watchTicker = async (params: WatchTickerParams): Promise<void> => {
    throw new NotImplementedError()
  }

  watchOrderbook = async (params: WatchOrderbookParams): Promise<Socket> => {
    const socket = io(this.ccxtServerUrl)

    socket.on('connect', () => {
      socket.emit('subscribeOrderbook', { exchangeId: this.exchangeId, symbol: params.symbol })
    })

    socket.on('orderbook', data => {
      this.orderbookCache[data.symbol] = data.orderbook
    })

    socket.on('disconnect', () => {
      console.log(`watchOrderbook with %o got disconnected.`, { exchange: this.exchangeId, ...params })
    })

    return socket
  }

  watchTrades = async (params: WatchTradesParams): Promise<void> => {
    throw new NotImplementedError()
  }

  watchOrders = async (onOrdersUpdate?: (orders: Order[], state: OrderState) => void): Promise<Socket> => {
    const socket = io(this.ccxtServerUrl)

    socket.on('connect', () => {
      socket.emit('subscribeOrders', { exchangeId: this.exchangeId })
    })

    socket.on('orders', (data: { orders: Order[] }) => {
      for (const order of data.orders) {
        this.orderState[order.id] = { ...this.orderState[order.id], ...order }
        this.orderHistory.push(order)
      }

      if (onOrdersUpdate) {
        onOrdersUpdate(data.orders, this.orderState)
      }
    })

    socket.on('disconnect', () => {
      console.log(`watchOrders with %o got disconnected.`, { exchange: this.exchangeId })
    })

    return socket
  }

  getOrderbookFromSocket = (symbol: string): OrderBook => this.orderbookCache[symbol]

  getOrderStateFromSocket = (): OrderState => this.orderState

  getOrdersHistoryFromSocket = (): Order[] => this.orderHistory

  initializeOrders = async () => (await this.fetchOrders()).forEach(o => (this.orderState[o.id] = o))

  extractStopPriceFromOrder = (order: Order): number => {
    throw new NotImplementedError()
  }
}

export default CcxtClient
