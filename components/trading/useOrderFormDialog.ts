import { useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import OrderForm from '~/components/trading/order-form.vue'
import OrderSummary from '~/components/trading/order-summary.vue'
import useCcxtClient from '~/components/trading/useCcxtClient'
import useOrderValidation from '~/components/trading/useOrderValidation'

const useOrderFormDialog = () => {
  const dialog = useDialog()
  const message = useMessage()

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
      onAfterEnter: async () => {
        console.log(opts)
        const { validateOrder } = useOrderValidation(opts.exchangeId)
        const result = await validateOrder({
          symbol: opts.symbol,
          side: opts.side,
          type: opts.type,
          amount: opts.size,
          price: opts.price,
        })

        if (result.message) message.error(result.message, { duration: 10000 })
        if (result.deny) dialog.destroyAll()
      },
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
