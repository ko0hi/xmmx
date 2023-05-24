import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Market, Order } from 'ccxt'

const useOrdersStore = defineStore('globalStore', () => {
  const ordersRef = ref<Order[]>([])
  const orderStateRef = ref<{ [key in string]: Order }>()

  const setOrders = (orders: Order[]): void => {
    ordersRef.value = orders.sort((a, b) => b.timestamp - a.timestamp)
  }

  return {
    orders: readonly(ordersRef),
    setOrders,
    orderStateRef,
  }
})

export default useOrdersStore
