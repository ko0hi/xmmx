import { useDialog } from 'naive-ui'
import OrderForm from '~/components/order/order-form.vue'
import OrderSummary from '~/components/order/order-summary.vue'

const useOrderFormDialog = () => {
  const dialog = useDialog()
  const openOrderFormDialog = (opts: {
    exchangeId: string
    symbol: string
    side?: 'buy' | 'sell'
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

  const openOrderConfirmationDialog = (opts: {
    exchangeId: string
    symbol: string
    side: 'buy' | 'sell'
    type: 'limit' | 'market' | 'stopLimit' | 'stopMarket'
    size: number
    price?: number
    triggerPrice?: number
    reduceOnly?: boolean
    postOnly?: boolean
    disableBuy?: boolean
    disableSell?: boolean
  }) => {
    dialog.info({
      title: 'Confirm order',
      content: () =>
        h(
          OrderSummary,
          {
            exchangeId: opts.exchangeId,
            params: {
              symbol: opts.symbol,
              side: opts.side,
              type: opts.type,
              amount: opts.size,
              price: opts.price,
              triggerPrice: opts.triggerPrice,
              reduceOnly: opts.reduceOnly,
              postOnly: opts.postOnly,
            },
          },
          ''
        ),
      positiveText: 'Order',
      negativeText: 'Cancel',
      onPositiveClick: async () => {
        const { client } = useCcxtClient(opts.exchangeId)
        await client.value
          .order({
            symbol: opts.symbol,
            side: opts.side,
            type: opts.type,
            amount: opts.size,
            price: opts.price,
            triggerPrice: opts.triggerPrice,
            reduceOnly: opts.reduceOnly,
            postOnly: opts.postOnly,
          })
          .then(
            result => {
              dialog.destroyAll()
            },
            error => {
              dialog.destroyAll()
              dialog.error({
                title: `${error.statusCode}: Failed to edit your order`,
                content: error.data,
              })
            }
          )
      },
      onNegativeClick: async () => {
        dialog.destroyAll()
      },
      onClose: () => {
        dialog.destroyAll()
      },
    })
  }

  return { openOrderFormDialog, openOrderConfirmationDialog }
}

export default useOrderFormDialog
