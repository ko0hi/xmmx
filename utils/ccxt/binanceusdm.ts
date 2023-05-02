import { type ExchangeOptions } from './types'
import ccxt from 'ccxt'
import CcxtClient from './ccxtClient'

class Binanceusdm extends CcxtClient {
  constructor(options: ExchangeOptions = {}) {
    super(ccxt.pro.binanceusdm, options)
  }
}

export default Binanceusdm
