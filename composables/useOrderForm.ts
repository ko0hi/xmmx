import { ref } from 'vue'
import useAvailableExchanges from '~/composables/useAvailableExchanges'
import useAvailableSymbols from '~/composables/useAvailableSymbols'

const useOrderForm = () => {
  const exchangeId = ref()
  const symbol = ref()
  const side = ref()
  const type = ref()
  const size = ref()
  const price = ref()
  const triggerPrice = ref()
  const reduceOnly = ref(false)
  const postOnly = ref(false)

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
    reset,
    exchangeSelectOptionsForNaiveUi: useAvailableExchanges().exchangeSelectOptionsForNaiveUi.value,
    symbolSelectOptionsForNaiveUi: computed(() => useAvailableSymbols(exchangeId).symbolSelectOptionsForNaiveUi).value,
    // symbolSelectOptionsForNaiveUi: computed(() =>
    //   exchangeId.value ? useAvailableSymbols(exchangeId.value).symbolSelectOptionsForNaiveUi.value : []
    // ),
    tickSize: computed(() =>
      exchangeId.value && symbol.value ? useCcxtClient(exchangeId).getTickSize(symbol.value) : null
    ),
    lotSize: computed(() =>
      exchangeId.value && symbol.value ? useCcxtClient(exchangeId).getLotSize(symbol.value) : null
    ),
  }
}

export default useOrderForm
