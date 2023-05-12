<script setup lang="ts">
import { Order } from 'ccxt'
import dayjs from 'dayjs'
import useCcxtClient from '~/composables/useCcxtClient'

const props = defineProps<{
  exchangeId: string
}>()

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
    render: (row: Order) => {
      return h(
        'span',
        {
          class: {
            'cursor-pointer': row.status == 'open',
          },
          onClick: async () => {
            const { client } = useCcxtClient(props.exchangeId)
            await client.value.cancelOrder({ id: row.id, symbol: row.symbol })
          },
        },
        row.status === 'open' ? '✖︎' : ''
      )
    },
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
