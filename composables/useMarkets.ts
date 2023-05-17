import useStore from '~/composables/useStore'
import { type Market } from 'ccxt'
import createClient from '~/utils/ccxt'
import { MarketNotFoundError } from '~/utils/exceptions'

const useMarkets = (): {
  initMarket: (exchangeId: string, exchangeOptions?: object) => Promise<Market[]>
  findMarket: (exchangeId: string, symbol: string) => Market | null
  listAvailableMarkets: (exchangeId: string) => string[]
  getTickSize: (exchangeId: string, symbol: string) => number | null
  getLotSize: (exchangeId: string, symbol: string) => number | null
} => {
  const { getMarkets, updateMarkets } = useStore()

  const initMarket = async (exchangeId: string, exchangeOptions: object = {}): Promise<Market[]> => {
    const mkts = getMarkets(exchangeId)
    if (mkts === undefined) {
      updateMarkets(exchangeId, await createClient(exchangeId, exchangeOptions).fetchMarkets())
    }
    return getMarkets(exchangeId)
  }

  const findMarket = (exchangeId: string, symbol: string): Market | null => {
    const mkts = getMarkets(exchangeId)

    if (mkts === undefined) return null

    const mkt = mkts.find(m => m.symbol === symbol)
    if (mkt === undefined) {
      throw new MarketNotFoundError(`${exchangeId} - ${symbol}`)
    }

    return mkt
  }

  const listAvailableMarkets = (exchangeId: string): string[] => {
    const mkts = getMarkets(exchangeId)
    return mkts ? mkts.map(m => m.symbol) : []
  }

  const getTickSize = (exchangeId: string, symbol: string): number | null => {
    const mkt = findMarket(exchangeId, symbol)
    if (mkt?.precision?.price === undefined) {
      return null
    } else {
      return 1 / Math.pow(10, mkt.precision.price)
    }
  }

  const getLotSize = (exchangeId: string, symbol: string): number | null => {
    const mkt = findMarket(exchangeId, symbol)
    if (mkt?.precision?.amount === undefined) {
      return null
    } else {
      return 1 / Math.pow(10, mkt.precision.amount)
    }
  }

  return {
    findMarket,
    initMarket,
    listAvailableMarkets,
    getTickSize,
    getLotSize,
  }
}

export default useMarkets
