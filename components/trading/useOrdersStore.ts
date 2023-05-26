import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { Order } from '~/utils/ccxt/types'

const useOrdersStore = defineStore('globalStore', () => {
  const ordersRef = ref<Order[]>([])
  const orderStateRef = ref<{ [key in string]: Order }>()

  const setOrders = (orders: Order[]): void => {
    ordersRef.value = orders.sort((a, b) => b.timestamp - a.timestamp)
  }

  return {
    orderStateRef,
    orders: readonly(ordersRef),
    setOrders,
  }
})

export default useOrdersStore
