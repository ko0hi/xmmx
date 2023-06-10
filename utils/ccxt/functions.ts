export const extractCurrencyFromSymbol = (symbol: string): string => symbol.split('/')[0]

export const normalizeOrderType = (type: string | null): string | null => {
  switch (type) {
    case 'stop_limit':
      return 'stopLimit'
    case 'stop_market':
      return 'stopMarket'
    case 'stop':
      return 'stopLimit'
    default:
      return type
  }
}

export const exchangeList = () => ['binance', 'binanceusdm', 'binancecoinm']
