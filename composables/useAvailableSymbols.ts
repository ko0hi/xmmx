import { computed, Ref } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'

const useAvailableSymbols = (exchangeId: string | Ref<string>, exchangeOptions: object | Ref<object> = {}) => {
  return {
    availableSymbols: computed(() => useCcxtClient(exchangeId, exchangeOptions).listAvailableMarkets()),
    symbolSelectOptionsForNaiveUi: computed(() =>
      useCcxtClient(exchangeId, exchangeOptions)
        .listAvailableMarkets()
        .map(s => ({ label: s, value: s }))
    ),
  }
}

export default useAvailableSymbols
