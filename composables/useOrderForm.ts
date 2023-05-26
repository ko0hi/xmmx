import useAvailableExchanges from '~/composables/useAvailableExchanges'
import useAvailableSymbols from '~/composables/useAvailableSymbols'
import { computed, Ref, ref, watch } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'

const useOrderForm = (initialParams: {
  exchangeId?: string
  symbol?: string
  side?: 'buy' | 'sell'
  type?: 'limit' | 'market' | 'stopLimit' | 'stopMarket'
  price?: number
  size?: number
  triggerPrice?: number
  reduceOnly?: boolean
  postOnly?: boolean
}) => {
  const exchangeId = ref(initialParams.exchangeId || null)
  const symbol = ref(initialParams.symbol || null)
  const side = ref(initialParams.side || null)
  const type = ref(initialParams.type || null)
  const size = ref(initialParams.size || null)
  const price = ref(initialParams.price || null)
  const triggerPrice = ref(initialParams.triggerPrice || null)
  const reduceOnly = ref(initialParams.reduceOnly || false)
  const postOnly = ref(initialParams.postOnly || false)

  const requiredFields = computed(() => {
    switch (type.value) {
      case 'limit':
        return ['exchangeId', 'symbol', 'size', 'price']
      case 'market':
        return ['exchangeId', 'symbol', 'size']
      case 'stopMarket':
        return ['exchangeId', 'symbol', 'size', 'triggerPrice']
      case 'stopLimit':
        return ['exchangeId', 'symbol', 'size', 'price', 'triggerPrice']
      default:
        return ['exchangeId', 'symbol', 'size']
    }
  })

  const isRequiredFieldsFilled = computed(() => {
    switch (type.value) {
      case 'limit':
        return exchangeId.value && symbol.value && size.value && price.value
      case 'market':
        return exchangeId.value && symbol.value && size.value
      case 'stopMarket':
        return exchangeId.value && symbol.value && size.value && triggerPrice.value
      case 'stopLimit':
        return exchangeId.value && symbol.value && size.value && price.value && triggerPrice.value
      default:
        return exchangeId.value && symbol.value && size.value
    }
  })

  const parameters = computed(() => ({
    exchange: exchangeId.value,
    symbol: symbol.value,
    side: side.value,
    type: type.value,
    size: size.value,
    price: price.value,
    triggerPrice: triggerPrice.value,
    reduceOnly: reduceOnly.value,
    postOnly: postOnly.value,
  }))

  const reset = () => {
    price.value = null
    size.value = null
    triggerPrice.value = null
    reduceOnly.value = false
    postOnly.value = false
  }

  watch(type, reset)

  return {
    exchangeId,
    symbol,
    side,
    type,
    size,
    price,
    triggerPrice,
    reduceOnly,
    postOnly,
    requiredFields,
    isRequiredFieldsFilled,
    parameters,
    reset,
    exchangeSelectOptionsForNaiveUi: useAvailableExchanges().exchangeSelectOptionsForNaiveUi.value,
    symbolSelectOptionsForNaiveUi: computed(() =>
      exchangeId.value !== null ? useAvailableSymbols(exchangeId as Ref<string>).symbolSelectOptionsForNaiveUi : []
    ).value,
    tickSize: computed(() =>
      exchangeId.value && symbol.value ? useCcxtClient(exchangeId as Ref<string>).getTickSize(symbol.value) : null
    ),
    lotSize: computed(() =>
      exchangeId.value && symbol.value ? useCcxtClient(exchangeId as Ref<string>).getLotSize(symbol.value) : null
    ),
  }
}

export default useOrderForm
