import CcxtClient from '~/utils/ccxt/ccxtClient'

class Binance extends CcxtClient {
  constructor() {
    super('binance')
  }

  isPrivateApiAvailable = async (): Promise<boolean> => {
    return false
  }
}

export default Binance
