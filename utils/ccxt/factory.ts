import type { ExchangeOptions } from './types'
import type CcxtClient from './ccxtClient'
import Binanceusdm from './binanceusdm'
import Binancecoinm from './binancecoinm'
import { UnsupportedExchangeError } from '../exceptions'

export const createClient = (exchangeId: string, options: ExchangeOptions = {}): CcxtClient => {
  const conf = useRuntimeConfig()
  switch (exchangeId) {
    case 'binanceusdm':
      return new Binanceusdm({
        ...{
          apiKey: conf.binance.apiKey,
          secret: conf.binance.secret,
        },
        ...options,
      })
    case 'binancecoinm':
      return new Binancecoinm({
        ...{
          apiKey: conf.binance.apiKey,
          secret: conf.binance.secret,
        },
        ...options,
      })
    default:
      throw new UnsupportedExchangeError(`Exchange ${exchangeId} is not supported`)
  }
}
