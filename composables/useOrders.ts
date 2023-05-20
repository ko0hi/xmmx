import { Ref } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'
import { ExchangeOptions } from '~/utils/ccxt/types'
import { storeToRefs } from 'pinia'
import { useDialog } from 'naive-ui'

const useOrders = (exchangeId: string | Ref<string>, exchangeOptions: ExchangeOptions | Ref<ExchangeOptions> = {}) => {
  const { client } = useCcxtClient(exchangeId, exchangeOptions)
  const store = useStore()
  const { orders } = storeToRefs(store)
  const dialog = useDialog()

  const updateOrders = async () => {
    await client.value.fetchOrders().then(
      orders => {
        store.setOrders(orders)
      },
      error => {
        dialog.error({
          title: `${error.statusCode}: Failed to fetch your orders`,
          content: error.data,
        })
      }
    )
  }

  return { orders, updateOrders }
}

export default useOrders
