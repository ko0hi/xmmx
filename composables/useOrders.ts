import { ComputedRef, Ref } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'
import { ExchangeOptions } from '~/utils/ccxt/types'
import { storeToRefs } from 'pinia'

const useOrders = (exchangeId: string | Ref<string>, exchangeOptions: ExchangeOptions | Ref<ExchangeOptions> = {}) => {
  const { client } = useCcxtClient(exchangeId, exchangeOptions)
  const store = useStore()
  const { orders } = storeToRefs(store)

  const updateOrders = async () => store.setOrders(await client.value.fetchOrders())

  return { orders, updateOrders }
}

export default useOrders
