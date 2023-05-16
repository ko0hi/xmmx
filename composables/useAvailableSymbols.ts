import { computed, ComputedRef } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'

const useAvailableSymbols = (
  exchangeId: string | ComputedRef<string>,
  exchangeOptions: object | ComputedRef<object> = {}
) => {
  const { listAvailableMarkets } = useCcxtClient(exchangeId, exchangeOptions)

  return {
    availableSymbols: computed(() => listAvailableMarkets()),
    symbolSelectOptionsForNaiveUi: computed(() =>
      useCcxtClient(exchangeId)
        .listAvailableMarkets()
        .map(s => ({ label: s, value: s }))
    ),
  }
}

export default useAvailableSymbols
