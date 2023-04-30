import { type ExchangeOptions } from './types'
import ccxt from 'ccxt'
import Client from './client'

class Binanceusdm extends Client {
  constructor(options: ExchangeOptions = {}) {
    super(ccxt.pro.binanceusdm, options)
  }
}

export default Binanceusdm
