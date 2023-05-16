import { extractCurrencyFromSymbol } from '~/utils/ccxt/functions'
import { ComputedRef } from 'vue'
import { castToRef } from '~/utils/vue/cast'

const useCurrencyIcon = (symbol: string | ComputedRef<string>) => {
  const symbolRef = castToRef(symbol)
  const currency = extractCurrencyFromSymbol(symbolRef.value)
  return { currency, iconPath: `/cryptocurrency/icon/${currency}.svg` }
}

export default useCurrencyIcon
