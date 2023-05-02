import { type ExchangeOptions } from './types'
import ccxt from 'ccxt'
import CcxtClient from './ccxtClient'

class Binancecoinm extends CcxtClient {
  constructor(options: ExchangeOptions = {}) {
    super(ccxt.pro.binancecoinm, options)
  }
}

export default Binancecoinm
