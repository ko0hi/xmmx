import useCcxtClient from '~/components/trading/useCcxtClient'
import { computed, Ref } from 'vue'

const useAvailableSymbols = (exchangeId: string | Ref<string>) => {
  return {
    availableSymbols: computed(() => useCcxtClient(exchangeId).listAvailableMarkets()),
    symbolSelectOptionsForNaiveUi: computed(() =>
      useCcxtClient(exchangeId)
        .listAvailableMarkets()
        .map(s => ({ label: s, value: s }))
    ),
  }
}

export default useAvailableSymbols
