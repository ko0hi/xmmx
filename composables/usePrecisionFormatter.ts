import { ComputedRef } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'

const usePrecisionFormatter = (
  exchangeId: string | ComputedRef<string>,
  exchangeOptions: object = {}
): {
  getPricePrecision: (symbol: string) => number | null
  formatSize: (symbol: string, value: number) => string
  getSizePrecision: (symbol: string) => number | null
  formatPrice: (symbol: string, value: number) => string
} => {
  const { findMarket } = useCcxtClient(exchangeId, exchangeOptions)

  const getPricePrecision = (symbol: string): number | null => findMarket(symbol)?.precision?.price ?? null
  const getSizePrecision = (symbol: string): number | null => findMarket(symbol)?.precision?.amount ?? null
  const formatValue = (value: number, precision: number | null, withShortForm: boolean = false): string => {
    if (precision === null) {
      return value.toString()
    } else if (value < 1000 || !withShortForm) {
      return value.toFixed(precision)
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(precision) + 'M'
    } else {
      return (value / 1000).toFixed(precision) + 'K'
    }
  }
  const formatPrice = (symbol: string, value: number): string => formatValue(value, getPricePrecision(symbol))
  const formatSize = (symbol: string, value: number, withShortForm: boolean = false): string =>
    formatValue(value, getSizePrecision(symbol), withShortForm)

  return { getPricePrecision, getSizePrecision, formatPrice, formatSize }
}

export default usePrecisionFormatter
