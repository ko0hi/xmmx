import type { ExchangeOptions } from './types'
import Binanceusdm from './binanceusdm'
import type Client from './client'

export const createClient = (exchangeId: string, options: ExchangeOptions = {}): Client => {
  switch (exchangeId) {
    case 'binanceusdm':
      return new Binanceusdm(options)
    default:
      throw new Error(`Exchange ${exchangeId} is not supported`)
  }
}
