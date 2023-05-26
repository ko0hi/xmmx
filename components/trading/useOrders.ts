import { Ref } from 'vue'
import useCcxtClient from '~/components/trading/useCcxtClient'
import { storeToRefs } from 'pinia'
import { useDialog } from 'naive-ui'
import useOrdersStore from '~/components/trading/useOrdersStore'

const useOrders = (exchangeId: string | Ref<string>) => {
  const { client } = useCcxtClient(exchangeId)
  const store = useOrdersStore()
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
