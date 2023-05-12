import {
  type Balances,
  type Exchange,
  type Market,
  type OHLCV,
  type Order,
  type OrderBook,
  type Ticker,
  type Trade,
} from 'ccxt'
import type {
  CancelAllOrdersParams,
  CancelOrderParams,
  CancelOrdersParams,
  CreateOrderParams,
  EditOrderParams,
  ExchangeOptions,
  FetchClosedOrdersParams,
  FetchMyTradesParams,
  FetchOHLCVParams,
  FetchOpenOrdersParams,
  FetchOrderbookParams,
  FetchOrderParams,
  FetchTickerParams,
  OrderState,
  WatchOrderbookParams,
  WatchTickerParams,
  WatchTradesParams,
} from './types'
import { io, Socket } from 'socket.io-client'

class CcxtClient {
  protected exchange: Exchange
  protected ccxtServerUrl: string
  protected baseUrl: string
  private readonly orderState: OrderState
  private readonly orderHistory: Order[]

  constructor(ExchangeClass: new (options: ExchangeOptions) => Exchange, options: ExchangeOptions) {
    this.exchange = new ExchangeClass(options)
    this.ccxtServerUrl = useRuntimeConfig().public.ccxtServerUrl
    this.baseUrl = `${this.ccxtServerUrl}/api/${this.exchange.id}`
    this.orderState = {}
    this.orderHistory = []
  }

  fetchMarkets = async (): Promise<Market[]> => {
    return await $fetch(`${this.baseUrl}/v1/markets`)
  }

  fetchTicker = async (params: FetchTickerParams): Promise<any> => {
    return await this.exchange.fetchTicker(params.symbol)
  }

  fetchOrderbook = async (params: FetchOrderbookParams): Promise<OrderBook> => {
    const { symbol, limit } = params
    return await this.exchange.fetchOrderBook(symbol, limit)
  }

  fetchOHLCV = async (params: FetchOHLCVParams): Promise<OHLCV[]> => {
    const { symbol, timeframe, since, limit } = params
    return await this.exchange.fetchOHLCV(symbol, timeframe, since, limit)
  }

  fetchBalance = async (): Promise<Balances> => {
    return await this.exchange.fetchBalance()
  }

  fetchOrder = async (params: FetchOrderParams): Promise<Order> => {
    const { id, symbol, params: extraParams } = params
    return await this.exchange.fetchOrder(id, symbol, extraParams)
  }

  fetchOpenOrders = async (params: FetchOpenOrdersParams | null = null): Promise<Order[]> => {
    return await $fetch(`${this.baseUrl}/v1/orders`, {
      method: 'GET',
      params: {
        exchangeId: this.exchange.id,
        symbol: params?.symbol,
      },
    })
  }

  fetchClosedOrders = async (params: FetchClosedOrdersParams): Promise<Order[]> => {
    const { symbol, since, limit, params: extraParams } = params
    return await this.exchange.fetchClosedOrders(symbol, since, limit, extraParams)
  }

  fetchOrders = async (): Promise<Order[]> => {
    return await $fetch(`${this.baseUrl}/v1/orders`, {
      method: 'GET',
      params: {
        exchangeId: this.exchange.id,
      },
    })
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
      },
    })
  }

  editOrder = async (params: EditOrderParams): Promise<Order> => {
    const { id, symbol, type, side, amount, price, params: extraParams } = params
    return await this.exchange.editOrder(id, symbol, type, side, amount, price, extraParams)
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
    const { ids, symbol, params: extraParams } = params
    const canceledOrders = []
    for (const id of ids) {
      canceledOrders.push(await this.exchange.cancelOrder(id, symbol, extraParams))
    }
    return canceledOrders
  }

  cancelAllOrders = async (params: CancelAllOrdersParams): Promise<boolean> => {
    if (this.exchange.has.cancelAllOrders !== undefined) {
      const { symbol, params: extraParams } = params
      return await this.exchange.cancelAllOrders(symbol, extraParams)
    } else {
      throw new Error('cancelAllOrders is not supported by this exchange.')
    }
  }

  fetchMyTrades = async (params: FetchMyTradesParams): Promise<Trade[]> => {
    const { symbol, since, limit, params: extraParams } = params
    return await this.exchange.fetchMyTrades(symbol, since, limit, extraParams)
  }

  watchTicker = async (params: WatchTickerParams): Promise<void> => {
    await this.exchange.watchOrderBook(params.symbol)
  }

  watchOrderbook = async (params: WatchOrderbookParams): Promise<Socket> => {
    const socket = io(this.ccxtServerUrl)

    socket.on('connect', () => {
      socket.emit('subscribeOrderbook', { exchangeId: this.exchange.id, symbol: params.symbol })
    })

    socket.on('orderbook', data => {
      // @ts-ignore
      this.exchange.orderbooks[data.symbol] = data.orderbook
    })

    socket.on('disconnect', () => {
      console.log(`watchOrderbook with %o got disconnected.`, { exchange: this.exchange.id, ...params })
    })

    return socket
  }

  watchTrades = async (params: WatchTradesParams): Promise<void> => {
    await this.exchange.watchTrades(params.symbol)
  }

  watchOrders = async (onOrdersUpdate?: (orders: Order[], state: OrderState) => void): Promise<Socket> => {
    const socket = io(this.ccxtServerUrl)

    socket.on('connect', () => {
      socket.emit('subscribeOrders', { exchangeId: this.exchange.id })
    })

    socket.on('orders', (data: { orders: Order[] }) => {
      for (const order of data.orders) {
        this.orderState[order.id] = order
        this.orderHistory.push(order)
      }

      if (onOrdersUpdate) {
        onOrdersUpdate(data.orders, this.orderState)
      }
    })

    socket.on('disconnect', () => {
      console.log(`watchOrders with %o got disconnected.`, { exchange: this.exchange.id })
    })

    return socket
  }

  // @ts-expect-error('no type in ccxt')
  sleep = async (interval: number): Promise<void> => this.exchange.sleep(interval)
  // @ts-expect-error('no type in ccxt')
  getTickerFromSocket = (symbol: string): Ticker => this.exchange.tickers[symbol]
  // @ts-expect-error('no type in ccxt')
  getOrderbookFromSocket = (symbol: string): Orderbook => this.exchange.orderbooks[symbol]

  getTradesFromSocket = (symbol: string): Trade => this.exchange.trades[symbol]

  getOrderStateFromSocket = (): OrderState => this.orderState

  getOrdersHistoryFromSocket = (): Order[] => this.orderHistory

  getExchange = (): Exchange => this.exchange

  initializeOrders = async () => (await this.fetchOrders()).forEach(o => (this.orderState[o.id] = o))
}

export default CcxtClient
