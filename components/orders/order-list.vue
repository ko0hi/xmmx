<script setup lang="ts">
import { Order } from 'ccxt'
import dayjs from 'dayjs'
import useCcxtClient from '~/composables/useCcxtClient'
import useEditOrder from '~/composables/useEditOrder'
import FontawesomeIconWrapper from '~/components/fontawesome-icon-wrapper.vue'

const props = defineProps<{
  exchangeId: string
}>()

const { client, getTickSize, getLotSize } = useCcxtClient(props.exchangeId)
const { formatPrice, formatSize } = usePrecisionFormatter(props.exchangeId)
const { editOrder } = useEditOrder(props.exchangeId)
const { orderState } = useOrderState(props.exchangeId)

watch(orderState, () => {
  console.log('CHANGED', orderState)
})

const orders = computed(() => Object.values(orderState.value).sort((a, b) => b.timestamp - a.timestamp))

const columns = computed(() => [
  {
    title: '',
    key: 'cancel',
    align: 'center',
    width: 30,
    render: (row: Order) =>
      row.status == 'open'
        ? h(FontawesomeIconWrapper, {
            class: {
              'cursor-pointer text-red-500': row.status == 'open',
            },
            icon: ['fas', 'xmark'],
            onClick: async () => {
              const { client } = useCcxtClient(props.exchangeId)
              await client.value.cancelOrder({ id: row.id, symbol: row.symbol })
            },
          })
        : '',
  },
  {
    title: '',
    key: 'clone',
    align: 'center',
    width: 30,
    render: (row: Order) => {
      return h(
        'span',
        {
          class: 'cursor-pointer text-blue-500',
          onClick: async () => {
            const { client } = useCcxtClient(props.exchangeId)
            await client.value.createOrder({
              symbol: row.symbol,
              side: row.side,
              type: row.type,
              amount: row.amount,
              price: row.price,
            })
          },
        },
        '♻︎'
      )
    },
  },
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 100,
    resizable: true,
    render: row => row.id.slice(0, 3) + '...' + row.id.slice(-3),
  },
  {
    title: 'Time',
    key: 'datetime',
    align: 'center',
    width: 120,
    resizable: true,
    render: (row: Order) => dayjs(row.datetime).format('MM/DD HH:mm'),
    sorter: (a: Order, b: Order) => b.timestamp - a.timestamp,
  },
  {
    title: 'Side',
    key: 'side',
    align: 'center',
    filterOptions: [
      { label: 'Buy', value: 'buy' },
      { label: 'Sell', value: 'sell' },
    ],
    width: 80,
    resizable: true,
    filter: (value, row) => row.side == value,
    render: (row: Order) =>
      h(
        'span',
        {
          class: {
            'text-green-500': row.side === 'buy',
            'text-red-500': row.side === 'sell',
          },
        },
        row.side.slice(0, 1).toUpperCase()
      ),
  },
  {
    title: 'Symbol',
    key: 'symbol',
    align: 'center',
    width: 180,
    resizable: true,
    render: (row: Order) => h('span', { class: 'text-xs' }, row.symbol),
  },
  {
    title: 'Size',
    key: 'amount',
    align: 'center',
    width: 100,
    resizable: true,
    render: (row: Order) =>
      row.type == 'limit' && row.status == 'open'
        ? h(
            'div',
            {
              class: 'flex justify-around',
            },
            {
              default: () => [
                h(
                  'button',
                  {
                    class: 'n-button flex-none w-1/4',
                    onClick: () => editOrder(row, { amount: row.amount - getLotSize(row.symbol) }),
                  },
                  '↓'
                ),
                h(
                  'input',
                  {
                    class: 'text-center w-1/2',
                    value: row.amount,
                    onChange: e => {
                      const newAmount = formatSize(row.symbol, parseFloat(e.target.value))
                      e.target.value = newAmount
                      if (newAmount != row.amount) {
                        editOrder(row, { amount: e.target.value })
                      }
                    },
                  },
                  row.amount
                ),
                h(
                  'button',
                  {
                    class: 'n-button flex-none w-1/4',
                    onClick: () => editOrder(row, { amount: row.amount + getLotSize(row.symbol) }),
                  },
                  '↑'
                ),
              ],
            }
          )
        : row.amount,
  },
  {
    title: 'Filled',
    key: 'filled',
    align: 'center',
    width: 100,
    resizable: true,
  },
  {
    title: 'Price',
    key: 'price',
    align: 'center',
    width: 130,
    resizable: true,
    render: (row: Order) =>
      row.type == 'limit' && row.status == 'open'
        ? h(
            'div',
            {
              class: 'flex justify-around',
            },
            {
              default: () => [
                h(
                  'button',
                  {
                    class: 'n-button flex-none w-1/4',
                    onClick: async () => editOrder(row, { price: row.price - getTickSize(row.symbol) }),
                  },
                  '↓'
                ),
                h(
                  'input',
                  {
                    class: 'text-center w-1/2',
                    value: row.price,
                    onChange: e => {
                      const newPrice = formatPrice(row.symbol, parseFloat(e.target.value))
                      e.target.value = newPrice
                      if (newPrice != row.price) {
                        editOrder(row, { price: e.target.value })
                      }
                    },
                  },
                  row.price
                ),
                h(
                  'button',
                  {
                    class: 'n-button flex-none w-1/4',
                    onClick: async () => editOrder(row, { price: row.price + getTickSize(row.symbol) }),
                  },
                  '↑'
                ),
              ],
            }
          )
        : row.price,
  },
  {
    title: 'Avg Price',
    key: 'average',
    align: 'center',
    width: 130,
    resizable: true,
  },
  {
    title: 'Stop Price',
    key: 'stop',
    align: 'center',
    width: 130,
    resizable: true,
    render: (row: Order) => row.info?.stopPrice,
  },
  {
    title: 'Remain',
    align: 'center',
    width: 130,
    resizable: true,
    render: (row: Order) => (row.status == 'open' ? row.amount - row.filled : '-'),
  },
  {
    title: 'Status',
    key: 'status',
    align: 'center',
    filterOptions: [
      { label: 'open', value: 'open' },
      { label: 'canceled', value: 'canceled' },
      { label: 'closed', value: 'closed' },
      { label: 'expired', value: 'expired' },
    ],
    width: 100,
    resizable: true,
    filter: (value, row) => row.status == value,
    render: (row: Order) =>
      h(
        'span',
        {
          class: {
            'text-green-500': row.status === 'closed',
            'text-gray-500': row.status === 'canceled' || row.status == 'expired',
            'text-blue-500': row.status == 'open',
          },
        },
        row.status
      ),
  },
])
</script>

<template>
  <div>
    <n-data-table
      v-if="orders.length > 0"
      class="order-table"
      :columns="columns"
      :data="computed(() => orders).value"
      :max-height="600"
      :pagination="{ pageSize: 30 }"
    />
  </div>
</template>

<style>
.n-data-table-filter-menu button.n-button.n-button--primary-type.n-button--tiny-type {
  background-color: #18a058;
}
</style>
