<script setup lang="ts">
import { computed, CSSProperties, ref } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'
import useCurrencyIcon from '~/composables/useCurrencyIcon'
import { useDialog } from 'naive-ui'
import useOrderFormDialog from '~/composables/useOrderFormDialog'

type OrderbookProps = {
  exchangeId?: string
  symbol?: string
  interval?: number
  limit?: number
  round?: number
  exchangeOptions?: object
}

const props = withDefaults(defineProps<OrderbookProps>(), {
  exchangeId: 'binanceusdm',
  symbol: 'BTC/USDT:USDT',
  interval: 1000,
  limit: 5,
  round: null,
  exchangeOptions: () => {},
})

const exchangeId = ref(props.exchangeId)
const symbol = ref(props.symbol)
const interval = ref(props.interval)
const limit = ref(props.limit)
const round = ref(props.round)
const exchangeOptions = ref(props.exchangeOptions)
const clicked = ref()

const { listAvailableMarkets, getTickSize } = useCcxtClient(exchangeId, exchangeOptions)
const { openOrderFormDialog } = useOrderFormDialog()

const options = computed(() => listAvailableMarkets().map(item => ({ label: `${item}`, value: item })))
const tickSize = computed(() => {
  try {
    return getTickSize(symbol.value)
  } catch (MarketNotFoundError) {
    return null
  }
})

const openOrderFormFromOrderbookClick = () => {
  openOrderFormDialog({
    exchangeId: clicked.value.exchangeId,
    symbol: clicked.value.symbol,
    side: clicked.value.side,
    type: 'limit',
    price: parseFloat(clicked.value.price),
    disableBuy: clicked.value.side == 'ask',
    disableSell: clicked.value.side == 'bid',
  })
}

const openOrderFormFromButtonClick = (side: string) => {
  openOrderFormDialog({
    exchangeId: exchangeId.value,
    symbol: symbol.value,
    side: side,
    type: 'limit',
    disableBuy: side == 'sell',
    disableSell: side == 'buy',
  })
}

watch(exchangeId, () => (symbol.value = listAvailableMarkets()[0]))
watch([clicked], openOrderFormFromOrderbookClick)
watch([exchangeId, symbol, tickSize], () => (round.value = tickSize.value), { immediate: true })

const labelStyle: CSSProperties = computed(() => ({
  fontSize: '10px',
  fontWeight: 'bold',
}))
</script>

<template>
  <div class="flex flex-col gap-y-5">
    <n-form
      v-if="options.length > 0"
      size="small"
      :show-feedback="false"
      :show-label="true"
      label-width="100"
      label-placement="left"
      label-align="right"
    >
      <n-form-item class="my-2" label="Exchange" :label-style="labelStyle">
        <n-select
          v-model:value="exchangeId"
          :options="[
            { label: 'binanceusdm', value: 'binanceusdm' },
            { label: 'binancecoinm', value: 'binancecoinm' },
          ]"
          filterable
        />
      </n-form-item>
      <n-form-item class="my-2" label="Symbol" :label-style="labelStyle">
        <n-select
          v-model:value="symbol"
          :options="options"
          filterable
          :render-label="
            option =>
              h('div', { class: 'flex items-center gap-2' }, [
                h('img', { src: useCurrencyIcon(option.label).iconPath, class: 'w-3' }),
                h('span', {}, option.label),
              ])
          "
        />
      </n-form-item>
      <n-form-item class="my-2" label="Display" :label-style="labelStyle">
        <n-radio-group v-model:value="limit">
          <n-radio v-for="(item, index) in [5, 10, 30, 50]" :key="index" :value="item" :label="item.toString()" />
        </n-radio-group>
      </n-form-item>
      <n-form-item class="my-2" label="Round" :label-style="labelStyle">
        <n-radio-group v-model:value="round">
          <n-radio
            v-for="item in [1, 10, 100, 1000]"
            :key="item"
            :value="tickSize * item"
            :label="(tickSize * item).toString()"
          />
        </n-radio-group>
      </n-form-item>
      <n-form-item class="my-2" label="Interval" :label-style="labelStyle">
        <n-radio-group v-model:value="interval">
          <n-radio
            v-for="(item, index) in [100, 500, 1000, 3000]"
            :key="index"
            :value="item"
            :label="item.toString()"
          ></n-radio>
        </n-radio-group>
      </n-form-item>
    </n-form>
    <orderbook-sidebyside
      v-if="symbol != null"
      v-model:clicked="clicked"
      :exchange-id="exchangeId"
      :symbol="symbol"
      :interval="interval"
      :limit="limit"
      :round="round"
      :exchange-options="exchangeOptions"
    >
      <template #afterOrderbook>
        <n-button class="rounded-md w-full m-3" size="tiny" type="success" @click="openOrderFormFromButtonClick('buy')"
          >BUY
        </n-button>
        <n-button class="rounded-md w-full m-3" size="tiny" type="error" @click="openOrderFormFromButtonClick('sell')"
          >SELL
        </n-button>
      </template>
    </orderbook-sidebyside>
  </div>
</template>

<style scoped></style>
