import { extractCurrencyFromSymbol } from '~/utils/ccxt/functions'
import { castToRef } from '~/utils/vue/cast'
import { Ref } from 'vue'

const useCurrencyIcon = (symbol: string | Ref<string>) => {
  const symbolRef = castToRef(symbol)
  const currency = extractCurrencyFromSymbol(symbolRef.value)
  return { currency, iconPath: `/cryptocurrency/icon/${currency.toLowerCase()}.svg` }
}

export default useCurrencyIcon
