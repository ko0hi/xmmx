import useCcxtClient from '~/components/trading/useCcxtClient'
import { computed, onMounted, Ref, triggerRef } from 'vue'
import { useDialog } from 'naive-ui'

const useOrderState = (exchangeId: string | Ref<string>) => {
  const { client } = useCcxtClient(exchangeId)
  const orderState = computed(() => client.value.getOrderStateFromSocket())
  const openOrders = computed(() => Object.values(orderState.value).filter(order => order.status === 'open'))
  const dialog = useDialog()

  onMounted(async () => {
    await client.value.initializeOrders().catch(error => {
      // FIXME
      // dialog.error({
      //   title: `${error.statusCode}: Failed to initialize your orders`,
      //   content: error.data,
      // })
    })
    await client.value.watchOrders(() => triggerRef(orderState))
    triggerRef(orderState)
  })

  return { orderState, openOrders }
}

export default useOrderState
