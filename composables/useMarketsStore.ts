import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Market } from '~/utils/ccxt/types'

const useMarketsStore = defineStore('marketStore', () => {
  const marketsRef = ref<Record<string, Market[]>>({})
  const isOnFetching = ref<Map<string, true>>(new Map<string, true>())
  const getMarkets = (name: string): Market[] => marketsRef.value[name]
  const setMarkets = (name: string, markets: Market[]): void => {
    marketsRef.value[name] = markets
  }

  return {
    getMarkets,
    setMarkets,
    isOnFetching,
  }
})

export default useMarketsStore
