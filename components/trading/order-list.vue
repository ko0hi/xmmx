<script setup lang="ts">
import dayjs from 'dayjs'
import useCcxtClient from '~/components/trading/useCcxtClient'
import useEditOrder from '~/components/trading/useEditOrder'
import useCurrencyIcon from '~/composables/useCurrencyIcon'
import useOrderFormDialog from '~/components/trading/useOrderFormDialog'
import usePrecisionFormatter from '~/components/trading/usePrecisionFormatter'
import useOrderState from '~/components/trading/useOrderState'
import { computed, h } from 'vue'
import { Order } from '~/utils/ccxt/types'
import FontawesomeIconWrapper from '~/components/ui/fontawesome-icon-wrapper.vue'
import NumberInputWithAdjustArrows from '~/components/ui/number-input-with-adjust-arrows.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { normalizeOrderType } from '~/utils/ccxt/functions'

const props = defineProps<{
  exchangeId: string
}>()

const { getTickSize, getLotSize } = useCcxtClient(props.exchangeId)
const { formatPrice, formatSize } = usePrecisionFormatter(props.exchangeId)
const { editOrder } = useEditOrder(props.exchangeId)
const { orderState, reload } = useOrderState(props.exchangeId)
const { openOrderFormDialog } = useOrderFormDialog()

const orders = computed(() => Object.values(orderState.value).sort((a, b) => b.timestamp - a.timestamp))

const symbolSet = computed(() => [...new Set(orders.value.map(o => o.symbol))])

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
    render: (row: Order) =>
      h(FontawesomeIconWrapper, {
        class: 'cursor-pointer text-blue-500',
        icon: ['fas', 'clone'],
        onClick: async () => {
          openOrderFormDialog({
            exchangeId: props.exchangeId,
            symbol: row.symbol,
            side: row.side,
            type: row.type,
            price: row.price,
            size: row.amount,
            disableBuy: row.side == 'sell',
            disableSell: row.side == 'buy',
          })
        },
      }),
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
    title: 'Type',
    key: 'type',
    align: 'center',
    width: 80,
    resizable: true,
    render: (row: Order) => normalizeOrderType(row.type),
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
    filterOptions: symbolSet.value.map(s => ({ label: s, value: s })),
    filter: (value, row) => row.symbol == value,
    width: 120,
    resizable: true,
    render: (row: Order) =>
      h('div', { class: 'flex justify-center items-center gap-2' }, [
        h('img', {
          class: 'w-4',
          src: useCurrencyIcon(row.symbol).iconPath,
        }),
        h('span', { class: 'text-xs' }, row.symbol),
      ]),
  },
  {
    title: 'Size',
    key: 'amount',
    align: 'center',
    width: 100,
    resizable: true,
    render: (row: Order) =>
      row.type == 'limit' && row.status == 'open'
        ? h(NumberInputWithAdjustArrows, {
            modelValue: row.amount,
            onClickDecrement: () =>
              editOrder(row, { amount: formatSize(row.symbol, row.amount - getLotSize(row.symbol)) }),
            onChange: e => editOrder(row, { amount: formatSize(row.symbol, parseFloat(e.target.value)) }),
            onClickIncrement: () =>
              editOrder(row, { amount: formatSize(row.symbol, row.amount + getLotSize(row.symbol)) }),
          })
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
        ? h(NumberInputWithAdjustArrows, {
            modelValue: row.price,
            onClickDecrement: () =>
              editOrder(row, { price: formatPrice(row.symbol, row.price - getTickSize(row.symbol)) }),
            onChange: e => editOrder(row, { price: formatPrice(row.symbol, parseFloat(e.target.value)) }),
            onClickIncrement: () =>
              editOrder(row, { price: formatPrice(row.symbol, row.price + getTickSize(row.symbol)) }),
          })
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
    <div class="flex flex-col">
      <div class="flex justify-end mb-2">
        <font-awesome-icon
          class="cursor-pointer text-gray-200 hover:text-gray-500 text-md"
          :icon="['fas', 'arrows-rotate']"
          @click="reload"
        />
      </div>
      <n-data-table
        v-if="orders.length > 0"
        class="order-table"
        :columns="columns"
        :data="computed(() => orders).value"
        :max-height="600"
        :pagination="{ pageSize: 30 }"
      />
    </div>
  </div>
</template>
