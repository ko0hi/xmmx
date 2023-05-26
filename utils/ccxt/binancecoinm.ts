import CcxtClient from '~/utils/ccxt/ccxtClient'

class Binancecoinm extends CcxtClient {
  constructor() {
    super('binancecoinm')
  }
}

export default Binancecoinm
