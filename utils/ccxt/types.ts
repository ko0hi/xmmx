import { Order } from 'ccxt'

export interface FetchTickerParams {
  symbol: string
}

export interface FetchOrderbookParams {
  symbol: string
  limit?: number
}

export interface FetchOHLCVParams {
  symbol: string
  timeframe: string
  since?: number
  limit?: number
}

export interface FetchBalanceParams {
  type?: string
}

export interface FetchOrderParams {
  id: string
  symbol?: string
  params?: any
}

export interface FetchOpenOrdersParams {
  symbol?: string
  since?: number
  limit?: number
  params?: any
}

export interface FetchClosedOrdersParams {
  symbol?: string
  since?: number
  limit?: number
  params?: any
}

export interface FetchMyTradesParams {
  symbol?: string
  since?: number
  limit?: number
  params?: any
}

export interface OrderParams {
  symbol: string
  type: 'limit' | 'market' | 'stopLimit' | 'stopMarket'
  side: 'buy' | 'sell'
  amount: number
  price?: number
  triggerPrice?: number
  postOnly?: boolean
  reduceOnly?: boolean
  params?: any
}

export interface CreateOrderParams {
  symbol: string
  type: 'limit' | 'market'
  side: 'buy' | 'sell'
  amount: number
  price?: number
  params?: any
}

export interface EditOrderParams {
  id: string
  symbol: string
  type: string
  side: string
  amount: number
  price?: number
  params?: any
}

export interface CancelOrderParams {
  id: string
  symbol?: string
  params?: any
}

export interface CancelOrdersParams {
  ids: string[]
  symbol?: string
  params?: any
}

export interface CancelAllOrdersParams {
  symbol: string
  params?: any
}

export interface WatchTickerParams {
  symbol: string
}

export interface WatchOrderbookParams {
  symbol: string
  limit?: number
}

export interface WatchTradesParams {
  symbol: string
}

export interface ExchangeOptions {
  enableRateLimit?: boolean
  rateLimit?: number
  verbose?: boolean
  timeout?: number
  apiKey?: string
  secret?: string
  uid?: string
  password?: string
  login?: boolean
  twofa?: string
  headers?: object
  nonce?: () => number
  proxy?: string
  origin?: string
  userAgent?: string
  adjustForTimeDifference?: boolean
  requestOptions?: object
  asyncWrite?: boolean
  enableDeprecatedNonceTag?: boolean
  enableRateLimitStrictMode?: boolean
  createOrderRateLimit?: number
  useWeb3ForFetchingOrders?: boolean
  enableLiveUpdates?: boolean
}

export type OrderState = { [key in string]: Order }
