import useStore from '~/composables/useStore'
import { type Market } from 'ccxt'
import createClient from '~/utils/ccxt'

const useMarkets = (): {
  findMarket: (exchangeId: string, symbol: string) => Market
  getAvailableSymbols: (exchangeId: string) => string[]
  initMarket: (exchangeId: string, exchangeOptions?: object) => Promise<Market[]>
} => {
  const { getMarkets, updateMarkets } = useStore()

  const initMarket = async (exchangeId: string, exchangeOptions: object = {}): Promise<Market[]> => {
    const mkts = getMarkets(exchangeId)
    if (mkts === undefined) {
      updateMarkets(exchangeId, await createClient(exchangeId, exchangeOptions).fetchMarkets())
    }
    return getMarkets(exchangeId)
  }

  const findMarket = (exchangeId: string, symbol: string): Market => {
    const mkts = getMarkets(exchangeId)
    const mkt = mkts.find(m => m.symbol === symbol)
    if (mkt === undefined) {
      throw new ReferenceError(`Market not found for ${exchangeId} - ${symbol}`)
    }
    return mkt
  }

  const getAvailableSymbols = (exchangeId: string): string[] => getMarkets(exchangeId).map(m => m.symbol)

  return {
    findMarket,
    initMarket,
    getAvailableSymbols,
  }
}

export default useMarkets
