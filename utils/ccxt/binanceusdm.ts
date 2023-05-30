import { EditOrderParams, FetchOpenOrdersParams, Order, OrderParams } from './types'
import CcxtClient from './ccxtClient'
import { UnsupportedOrderTypeError } from '~/utils/exceptions'

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

const orderStatuses: { [key in string]: string } = {
  NEW: 'open',
  PARTIALLY_FILLED: 'open',
  ACCEPTED: 'open',
  FILLED: 'closed',
  CANCELED: 'canceled',
  CANCELLED: 'canceled',
  PENDING_CANCEL: 'canceling',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  EXPIRED_IN_MATCH: 'expired',
}

const mapBinanceOrderResponseToCcxtOrder = (o: BinanceOrderResponse): Order => ({
  id: o.orderId,
  clientOrderId: o.clientOrderId,
  datetime: new Date(parseInt(o.time)).toISOString(),
  timestamp: parseInt(o.time),
  lastTradeTimestamp: parseInt(o.updateTime),
  status: orderStatuses[o.status],
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
  constructor() {
    super('binanceusdm')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchOpenOrders = async (params: FetchOpenOrdersParams | null = null): Promise<Order[]> => {
    const orders = await $fetch<BinanceOrderResponse[]>(`${this.baseUrl}/v1/implicits/private`, {
      method: 'GET',
      params: {
        method: 'fapiPrivateGetOpenOrders',
      },
    })

    return orders.map(mapBinanceOrderResponseToCcxtOrder)
  }

  fetchOrders = async (): Promise<Order[]> => {
    const orders = await $fetch<BinanceOrderResponse[]>(`${this.baseUrl}/v1/implicits/private`, {
      method: 'GET',
      params: {
        method: 'fapiPrivateGetAllOrders',
      },
    })
    return orders.map(mapBinanceOrderResponseToCcxtOrder)
  }

  order = async (params: OrderParams): Promise<Order> => {
    if (params.postOnly) {
      params.params = { ...params.params, timeInForce: 'GTX' }
    }

    if (params.reduceOnly) {
      params.params = { ...params.params, reduceOnly: true }
    }

    switch (params.type) {
      case 'limit':
        return await super.order(params)
      case 'market':
        return await super.order(params)
      case 'stopMarket':
        return await this.createOrder({
          symbol: params.symbol,
          type: 'STOP_MARKET',
          side: params.side,
          amount: params.amount,
          params: {
            stopPrice: params.triggerPrice,
          },
        })
      case 'stopLimit':
        return await this.createOrder({
          symbol: params.symbol,
          type: 'STOP',
          side: params.side,
          amount: params.amount,
          price: params.price,
          params: {
            stopPrice: params.triggerPrice,
          },
        })
      default:
        throw new UnsupportedOrderTypeError(`${params.type} for ${this.exchangeId}`)
    }
  }

  editOrder = async (params: EditOrderParams): Promise<Order> => {
    const resp = await $fetch<Omit<BinanceOrderResponse, 'time'>>(`${this.baseUrl}/v1/implicits/private`, {
      method: 'PUT',
      params: {
        method: 'fapiPrivatePutOrder',
        orderId: params.id,
        symbol: params.symbol.split(':')[0].replace('/', ''),
        side: params.side.toUpperCase(),
        type: params.type,
        price: params.price,
        quantity: params.amount,
      },
    })
    return mapBinanceOrderResponseToCcxtOrder({ ...resp, ...{ time: new Date().getTime().toString() } })
  }

  extractStopPriceFromOrder = (order: Order): number => {
    return parseFloat(order.info.stopPrice)
  }

  transformOrderMessage = (message: Order): Order => {
    return { ...message, info: { ...message.info, stopPrice: message.info.sp } }
  }
}

export default Binanceusdm
