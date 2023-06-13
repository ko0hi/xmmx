import { Ref } from 'vue'
import useTradingPreferencesStore from '~/components/trading/useTradingPreferencesStore'
import useCcxtClient from '~/components/trading/useCcxtClient'
import { storeToRefs } from 'pinia'

const useOrderValidation = (exchangeId: string | Ref<string>) => {
  const { disableOrderValidation, softAmountLimit, hardAmountLimit, softPriceLimit, hardPriceLimit } = storeToRefs(
    useTradingPreferencesStore()
  )
  const { client } = useCcxtClient(exchangeId)

  const checkAmountLimit = (price: number, amount: number) => {
    const usd = Math.round(price * amount)
    if (usd > hardAmountLimit.value) {
      return {
        deny: true,
        message: `Your order amount exceeds the hard limit: ${usd.toLocaleString()}USD > ${hardAmountLimit.value.toLocaleString()}USD`,
      }
    }

    if (usd > softAmountLimit.value) {
      return {
        deny: false,
        message: `Your order amount exceeds the soft limit: ${usd.toLocaleString()}USD > ${softAmountLimit.value.toLocaleString()}USD`,
      }
    }

    return { deny: false }
  }

  const checkPriceLimit = (price: number, side: 'buy' | 'sell' | string, best: number) => {
    const diff = (side == 'buy' ? price - best : best - price) / best
    const diffString = (diff * 100).toFixed(2)
    if (diff >= hardPriceLimit.value) {
      return {
        deny: true,
        message: `Your order price exceeds the hard limit: ${diffString}% (price=${price.toLocaleString()} vs. best=${best.toLocaleString()}).`,
      }
    }

    if (diff >= softPriceLimit.value) {
      return {
        deny: false,
        message: `Your order price exceeds the soft limit: ${diffString}% (price=${price.toLocaleString()} vs. best=${best.toLocaleString()}).`,
      }
    }

    return { deny: false }
  }

  const validateOrder = async (order: {
    symbol: string
    side: 'buy' | 'sell'
    amount: number
    type: string
    price?: number
  }): Promise<{ deny: boolean; message?: string }> => {
    if (disableOrderValidation.value) return { deny: false }
    const result = await client.value.fetchOrderbook({ symbol: order.symbol }).then(
      orderbook => {
        const { bids, asks } = orderbook
        const bid = bids[0][0]
        const ask = asks[0][0]
        const { price, amount } = order

        const refPrice = order.type === 'market' ? (order.side === 'buy' ? ask : bid) : price
        if (refPrice === undefined) return { deny: true, message: 'Failed to get reference price.' }

        const amountCheckResult = checkAmountLimit(refPrice, amount)
        if (amountCheckResult.deny) return amountCheckResult

        const priceCheckResult = checkPriceLimit(refPrice, order.side, order.side === 'buy' ? ask : bid)
        if (priceCheckResult.deny) return priceCheckResult

        return { deny: false, message: amountCheckResult.message || priceCheckResult.message }
      },
      error => {
        return {
          deny: true,
          message: `Failed to fetch ticker. Please try later or disable order validation: ${error.toString()}`,
        }
      }
    )
    return result
  }

  return { validateOrder }
}

export default useOrderValidation
