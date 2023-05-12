import { ComputedRef } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'
import { ExchangeOptions } from '~/utils/ccxt/types'
import { storeToRefs } from 'pinia'

const useOrders = (
  exchangeId: string | ComputedRef<string>,
  exchangeOptions: ExchangeOptions | ComputedRef<ExchangeOptions> = {}
) => {
  const { client } = useCcxtClient(exchangeId, exchangeOptions)
  const store = useStore()
  const { orders } = storeToRefs(store)

  const updateOrders = async () => store.setOrders(await client.value.fetchOrders())

  return { orders, updateOrders }
}

export default useOrders
