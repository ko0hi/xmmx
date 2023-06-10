import CcxtClient from '~/utils/ccxt/ccxtClient'

class Binancecoinm extends CcxtClient {
  constructor() {
    super('binancecoinm')
  }
  isPrivateApiAvailable = async (): Promise<boolean> => {
    return false
  }
}

export default Binancecoinm
