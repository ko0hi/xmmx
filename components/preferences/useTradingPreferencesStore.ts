import { defineStore } from 'pinia'
import { ref } from 'vue'

const useTradingPreferencesStore = defineStore(
  'tradingPreferencesStore',
  () => {
    // 発注時のバリデーションを無効化
    const disableOrderValidation = ref(false)
    // １回の発注量がsoftAmountLimit以上で警告
    const softAmountLimit = ref(20000)
    // １回の発注量がhardAmountLimit以上は禁止
    const hardAmountLimit = ref(100000)

    // １回の発注価格が最良気配値に対してsoftPriceLimit以上で警告
    const softPriceLimit = ref(0.3 / 100)
    // １回の発注価格が最良気配値に対してhardPriceLimit以上は禁止
    const hardPriceLimit = ref(1 / 100)

    return {
      disableOrderValidation,
      softAmountLimit,
      hardAmountLimit,
      softPriceLimit,
      hardPriceLimit,
    }
  },
  {
    persist: {
      storage: localStorage,
      debug: true,
    },
  }
)

export default useTradingPreferencesStore
