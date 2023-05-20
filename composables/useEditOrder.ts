import { ComputedRef } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'
import { Order } from 'ccxt'
import { useDialog } from 'naive-ui'

const useEditOrder = (exchangeId: string | ComputedRef<string>, exchangeOptions?: object | ComputedRef<object>) => {
  const { client } = useCcxtClient(exchangeId, exchangeOptions)
  const dialog = useDialog()

  const editOrder = async (
    currentOrder: Order,
    updateParams: { symbol?: string; type?: string; side?: 'buy' | 'sell'; amount?: number; price?: number }
  ) => {
    await client.value
      .editOrder({
        id: currentOrder.id,
        symbol: updateParams.symbol || currentOrder.symbol,
        type: updateParams.type || currentOrder.type,
        side: updateParams.side || currentOrder.side,
        amount: updateParams.amount || currentOrder.amount,
        price: updateParams.price || currentOrder.price,
      })
      .catch(error => {
        dialog.error({
          title: `${error.statusCode}: Failed to edit your order`,
          content: error.data,
        })
      })
  }

  return { editOrder }
}

export default useEditOrder
