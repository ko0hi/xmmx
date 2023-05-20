import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Market, Order } from 'ccxt'

const useStore = defineStore('globalStore', () => {
  const marketsRef = ref<Record<string, Market[]>>({})
  const ordersRef = ref<Order[]>([])
  const orderStateRef = ref<{ [key in string]: Order }>()

  const getMarkets = (name: string): Market[] => marketsRef.value[name]
  const updateMarkets = (name: string, markets: Market[]): void => {
    marketsRef.value[name] = markets
  }

  const setOrders = (orders: Order[]): void => {
    ordersRef.value = orders.sort((a, b) => b.timestamp - a.timestamp)
  }

  return {
    getMarkets,
    updateMarkets,
    orders: readonly(ordersRef),
    setOrders,
    orderStateRef,
  }
})

export default useStore
