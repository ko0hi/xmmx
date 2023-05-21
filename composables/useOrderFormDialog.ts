import { useDialog } from 'naive-ui'
import OrderForm from '~/components/order/order-form.vue'

const useOrderFormDialog = () => {
  const dialog = useDialog()
  const openOrderDialog = (opts: {
    exchangeId: string
    symbol: string
    side?: 'BUY' | 'SELL'
    type?: 'limit' | 'market' | 'stopLimit' | 'stopMarket'
    price?: number
    size?: number
    disableBuy?: boolean
    disableSell?: boolean
  }) => {
    dialog.info({
      title: 'Order',
      content: () =>
        h(OrderForm, {
          exchangeId: opts.exchangeId,
          symbol: opts.symbol,
          side: opts.side,
          type: opts.type,
          price: opts.price,
          size: opts.size,
          disableBuy: opts.disableBuy,
          disableSell: opts.disableSell,
        }),
    })
  }

  return { openOrderDialog }
}

export default useOrderFormDialog
