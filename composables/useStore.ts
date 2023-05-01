import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Market } from 'ccxt'

const useStore = defineStore('globalStore', () => {
  const marketsRef = ref<Record<string, Market[]>>({})

  const getMarkets = (name: string): Market[] => marketsRef.value[name]
  const updateMarkets = (name: string, markets: Market[]): void => {
    marketsRef.value[name] = markets
  }
  return {
    getMarkets,
    updateMarkets,
  }
})

export default useStore
