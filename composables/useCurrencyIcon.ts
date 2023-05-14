import { extractCurrencyFromSymbol } from '~/utils/ccxt/functions'

const useCurrencyIcon = (symbol: string) => {
  const currency = extractCurrencyFromSymbol(symbol)
  return { currency, iconPath: `/cryptocurrency/icon/${currency}.svg` }
}

export default useCurrencyIcon
