import { defineStore } from 'pinia'
import { ref } from 'vue'

type OrderbookConfig = { exchangeId: string; symbol: string }

const usePreferencesStore = defineStore(
  'preferenceStore',
  () => {
    const orderbookConfigs = ref<OrderbookConfig[]>([{ exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' }])

    return { orderbookConfigs }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)

export default usePreferencesStore
