import CcxtClient from '~/utils/ccxt/ccxtClient'

class Binance extends CcxtClient {
  constructor() {
    super('binance')
  }
}

export default Binance
