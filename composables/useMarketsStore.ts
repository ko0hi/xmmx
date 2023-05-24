import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Market, Order } from 'ccxt'

const useMarketsStore = defineStore('globalStore', () => {
  const marketsRef = ref<Record<string, Market[]>>({})

  const getMarkets = (name: string): Market[] => marketsRef.value[name]
  const setMarkets = (name: string, markets: Market[]): void => {
    marketsRef.value[name] = markets
  }

  return {
    getMarkets,
    setMarkets,
  }
})

export default useMarketsStore
