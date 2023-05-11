import { type ExchangeOptions, FetchOpenOrdersParams } from './types'
import ccxt, { Order } from 'ccxt'
import CcxtClient from './ccxtClient'

type BinanceOrderResponse = {
  orderId: string
  clientOrderId: string
  time: string
  updateTime: string
  symbol: string
  type: string
  side: string
  price: string
  avgPrice: string
  origQty: string
  executedQty: string
  cumQuote: string
  reduceOnly: boolean
  closePosition: boolean
  positionSide: string
  stopPrice: string
  priceProtect: boolean
  origType: string
  status: string
  timeInForce: string
  workingType: string
}

const mapBinanceOrderResponseToCcxtOrder = (o: BinanceOrderResponse): Order => ({
  id: o.orderId,
  clientOrderId: o.clientOrderId,
  datetime: new Date(parseInt(o.time)).toISOString(),
  timestamp: parseInt(o.time),
  lastTradeTimestamp: parseInt(o.updateTime),
  status: o.status.toLowerCase(),
  symbol: o.symbol.replace('USDT', '/USDT:USDT'),
  type: o.type.toLowerCase(),
  timeInForce: o.timeInForce,
  side: o.side.toLowerCase(),
  price: parseFloat(o.price),
  average: parseFloat(o.avgPrice),
  amount: parseFloat(o.origQty),
  filled: parseFloat(o.executedQty),
  remaining: parseFloat(o.origQty) - parseFloat(o.executedQty),
  cost: parseFloat(o.cumQuote),
  trades: [], // APIから取得できるデータに基づいて、必要に応じてこのフィールドを更新してください
  fee: {
    cost: 0, // APIから取得できるデータに基づいて、必要に応じてこのフィールドを更新してください
    currency: '', // APIから取得できるデータに基づいて、必要に応じてこのフィールドを更新してください
  },
  info: o,
})

class Binanceusdm extends CcxtClient {
  constructor(options: ExchangeOptions = {}) {
    super(ccxt.pro.binanceusdm, options)
  }

  fetchOpenOrders = async (params: FetchOpenOrdersParams | null = null): Promise<Order[]> => {
    const orders = await $fetch<BinanceOrderResponse[]>(`${this.ccxtServerUrl}/api/v1/implicits/private`, {
      method: 'GET',
      params: {
        exchangeId: this.exchange.id,
        method: 'fapiPrivateGetOpenOrders',
      },
    })

    return orders.map(mapBinanceOrderResponseToCcxtOrder)
  }

  fetchOrders = async (): Promise<Order[]> => {
    const orders = await $fetch<BinanceOrderResponse[]>(`${this.ccxtServerUrl}/api/v1/implicits/private`, {
      method: 'GET',
      params: {
        exchangeId: this.exchange.id,
        method: 'fapiPrivateGetAllOrders',
      },
    })
    return orders.map(mapBinanceOrderResponseToCcxtOrder)
  }
}

export default Binanceusdm
