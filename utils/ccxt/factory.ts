import type { ExchangeOptions } from './types'
import type CcxtClient from './ccxtClient'
import Binanceusdm from './binanceusdm'
import Binancecoinm from './binancecoinm'
import { UnsupportedExchangeError } from '../exceptions'

export const createClient = (exchangeId: string, options: ExchangeOptions = {}): CcxtClient => {
  switch (exchangeId) {
    case 'binanceusdm':
      return new Binanceusdm(options)
    case 'binancecoinm':
      return new Binancecoinm(options)
    default:
      throw new UnsupportedExchangeError(`Exchange ${exchangeId} is not supported`)
  }
}
