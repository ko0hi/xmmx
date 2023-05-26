import useMarketsStore from '~/components/trading/useMarketsStore'
import createClient from '~/utils/ccxt'
import { MarketNotFoundError } from '~/utils/exceptions'
import { useDialog } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { Market } from '~/utils/ccxt/types'

const useMarkets = (): {
  initMarket: (exchangeId: string, exchangeOptions?: object) => Promise<Market[]>
  findMarket: (exchangeId: string, symbol: string) => Market | null
  listAvailableMarkets: (exchangeId: string) => string[]
  getTickSize: (exchangeId: string, symbol: string) => number | null
  getLotSize: (exchangeId: string, symbol: string) => number | null
} => {
  const { getMarkets, setMarkets } = useMarketsStore()
  const { isOnFetching } = storeToRefs(useMarketsStore())
  const dialog = useDialog()

  const initMarket = async (exchangeId: string): Promise<Market[]> => {
    const mkts = getMarkets(exchangeId)
    if (mkts === undefined && isOnFetching.value.get(exchangeId) !== true) {
      isOnFetching.value.set(exchangeId, true)
      console.log(`Start fetch markets: ${exchangeId}`)
      await createClient(exchangeId)
        .fetchMarkets()
        .then(
          markets => setMarkets(exchangeId, markets),
          error => {
            dialog.error({
              title: `${error.statusCode}: Failed to fetch markets`,
              content: error.data,
            })
          }
        )
        .finally(() => {
          isOnFetching.value.delete(exchangeId)
          console.log(`End fetch markets: ${exchangeId}`)
        })
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
