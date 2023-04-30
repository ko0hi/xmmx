import { type ExchangeOptions } from './types'
import ccxt from 'ccxt'
import Client from './client'

class BinanceusdmClient extends Client {
  constructor(options: ExchangeOptions = {}) {
    super(ccxt.binanceusdm, options)
  }
}

export default BinanceusdmClient
