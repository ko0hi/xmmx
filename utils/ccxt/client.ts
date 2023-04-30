import { type Exchange, type Market, type OrderBook, type OHLCV, type Balances, type Order, type Trade } from 'ccxt'
import type {
  FetchTickerParams,
  FetchOrderbookParams,
  FetchOHLCVParams,
  FetchBalanceParams,
  FetchOrderParams,
  FetchOpenOrdersParams,
  FetchClosedOrdersParams,
  FetchMyTradesParams,
  CreateOrderParams,
  EditOrderParams,
  CancelOrderParams,
  CancelOrdersParams,
  CancelAllOrdersParams,
  ExchangeOptions,
} from './types'

class Client {
  protected exchange: Exchange

  constructor(ExchangeClass: new (options: ExchangeOptions) => Exchange, options: ExchangeOptions) {
    this.exchange = new ExchangeClass(options)
  }

  fetchMarkets = async (): Promise<Market[]> => {
    return await this.exchange.fetchMarkets()
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

  fetchBalance = async (exchange: Exchange, params: FetchBalanceParams): Promise<Balances> => {
    const { type } = params
    return await exchange.fetchBalance(type)
  }

  fetchOrder = async (params: FetchOrderParams): Promise<Order> => {
    const { id, symbol, params: extraParams } = params
    return await this.exchange.fetchOrder(id, symbol, extraParams)
  }

  fetchOpenOrders = async (params: FetchOpenOrdersParams): Promise<Order[]> => {
    const { symbol, since, limit, params: extraParams } = params
    return await this.exchange.fetchOpenOrders(symbol, since, limit, extraParams)
  }

  fetchClosedOrders = async (params: FetchClosedOrdersParams): Promise<Order[]> => {
    const { symbol, since, limit, params: extraParams } = params
    return await this.exchange.fetchClosedOrders(symbol, since, limit, extraParams)
  }

  createOrder = async (params: CreateOrderParams): Promise<Order> => {
    const { symbol, type, side, amount, price, params: extraParams } = params
    return await this.exchange.createOrder(symbol, type, side, amount, price, extraParams)
  }

  editOrder = async (params: EditOrderParams): Promise<Order> => {
    const { id, symbol, type, side, amount, price, params: extraParams } = params
    return await this.exchange.editOrder(id, symbol, type, side, amount, price, extraParams)
  }

  cancelOrder = async (params: CancelOrderParams): Promise<Order> => {
    const { id, symbol, params: extraParams } = params
    return await this.exchange.cancelOrder(id, symbol, extraParams)
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

  getExchange = (): Exchange => this.exchange
}

export default Client
