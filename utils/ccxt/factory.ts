import type CcxtClient from './ccxtClient'
import Binanceusdm from './binanceusdm'
import { UnsupportedExchangeError } from '../exceptions'
import Binancecoinm from '~/utils/ccxt/binancecoinm'
import Binance from '~/utils/ccxt/binance'

export const createClient = (exchangeId: string): CcxtClient => {
  switch (exchangeId) {
    case 'binance':
      return new Binance()
    case 'binanceusdm':
      return new Binanceusdm()
    case 'binancecoinm':
      return new Binancecoinm()
    default:
      throw new UnsupportedExchangeError(`Exchange ${exchangeId} is not supported`)
  }
}
