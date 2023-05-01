import { onMounted } from 'vue'
import useMarkets from '~/composables/useMarkets'

const usePrecisionFormatter = (
  exchangeId: string,
  exchangeOptions: object = {}
): {
  getPricePrecision: (symbol: string) => number
  formatSize: (symbol: string, value: number) => string
  getSizePrecision: (symbol: string) => number
  formatPrice: (symbol: string, value: number) => string
} => {
  const { initMarket, findMarket } = useMarkets()

  onMounted(async () => {
    await initMarket(exchangeId, exchangeOptions)
  })

  const getPricePrecision = (symbol: string): number => findMarket(exchangeId, symbol).precision.price
  const getSizePrecision = (symbol: string): number => findMarket(exchangeId, symbol).precision.amount

  const formatValue = (value: number, precision: number, withShortForm: boolean = false): string => {
    if (value < 1000 || !withShortForm) {
      return value.toFixed(precision)
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(precision) + 'M'
    } else {
      return (value / 1000).toFixed(precision) + 'K'
    }
  }
  const formatPrice = (symbol: string, value: number): string => formatValue(value, getPricePrecision(symbol))
  const formatSize = (symbol: string, value: number): string => formatValue(value, getSizePrecision(symbol), true)

  return { getPricePrecision, getSizePrecision, formatPrice, formatSize }
}

export default usePrecisionFormatter
