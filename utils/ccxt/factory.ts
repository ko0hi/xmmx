import type { ExchangeOptions } from './types'
import BinanceusdmClient from './binanceusdmClient'
import type Client from './client'

export const createClient = (exchangeId: string, options: ExchangeOptions = {}): Client => {
  switch (exchangeId) {
    case 'binanceusdm':
      return new BinanceusdmClient(options)
    default:
      throw new Error(`Exchange ${exchangeId} is not supported`)
  }
}
