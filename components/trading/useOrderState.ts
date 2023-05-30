import useCcxtClient from '~/components/trading/useCcxtClient'
import { computed, onMounted, Ref, triggerRef } from 'vue'
import { useDialog } from 'naive-ui'
import useOrderStore from '~/components/trading/useOrderStore'
import { storeToRefs } from 'pinia'

const useOrderState = (exchangeId: string | Ref<string>) => {
  const { client } = useCcxtClient(exchangeId)

  const orderStore = useOrderStore(exchangeId)
  const { orderState } = storeToRefs(orderStore)
  const openOrders = computed(() => Object.values(orderState.value).filter(order => order.status === 'open'))

  return { orderState, openOrders, reload: orderStore.reload }
}

export default useOrderState
