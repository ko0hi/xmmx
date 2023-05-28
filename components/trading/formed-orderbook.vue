<script setup lang="ts">
import { computed, CSSProperties, h, onMounted, Ref, ref, watch } from 'vue'
import useCcxtClient from '~/components/trading/useCcxtClient'
import useCurrencyIcon from '~/composables/useCurrencyIcon'
import useOrderFormDialog from '~/components/trading/useOrderFormDialog'

type Config = {
  exchangeId?: string
  symbol?: string
  interval?: number
  limit?: number
  round?: number
}

const props = withDefaults(defineProps<{ initialConfig: Config; config?: Ref<Config> }>(), {
  initialConfig: () => ({
    exchangeId: 'binanceusdm',
    symbol: 'BTC/USDT:USDT',
    interval: 1000,
    limit: 5,
    round: null,
  }),
  config: ref(),
})

const exchangeId = ref(props.initialConfig.exchangeId ?? null)
const symbol = ref(props.initialConfig.symbol ?? null)
const interval = ref(props.initialConfig.interval ?? 1000)
const limit = ref(props.initialConfig.limit ?? 5)
const round = ref(props.initialConfig.round ?? null)
const clickedOrder = ref()

const { listAvailableMarkets, getTickSize } = useCcxtClient(exchangeId)
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
    exchangeId: clickedOrder.value.exchangeId,
    symbol: clickedOrder.value.symbol,
    side: clickedOrder.value.side,
    type: 'limit',
    price: parseFloat(clickedOrder.value.price),
    disableBuy: clickedOrder.value.side == 'ask',
    disableSell: clickedOrder.value.side == 'bid',
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

const emits = defineEmits<{ e: 'update:config'; config: Config }>()
const emitConfig = () =>
  // eslint-disable-next-line vue/require-explicit-emits
  emits('update:config', {
    exchangeId: exchangeId.value,
    symbol: symbol.value,
    interval: interval.value,
    limit: limit.value,
    round: round.value,
  })

watch(exchangeId, () => (symbol.value = listAvailableMarkets()[0]))
watch([clickedOrder], openOrderFormFromOrderbookClick)
watch([exchangeId, symbol, tickSize], () => (round.value = tickSize.value), { immediate: true })
watch([exchangeId, symbol, interval, limit, round], emitConfig, { immediate: true })

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
    <trading-the-orderbook
      v-if="symbol != null"
      v-model:clicked="clickedOrder"
      :exchange-id="exchangeId"
      :symbol="symbol"
      :interval="interval"
      :limit="limit"
      :round="round"
    >
      <template #afterOrderbook>
        <n-button class="rounded-md w-full m-3" size="tiny" type="success" @click="openOrderFormFromButtonClick('buy')"
          >BUY
        </n-button>
        <n-button class="rounded-md w-full m-3" size="tiny" type="error" @click="openOrderFormFromButtonClick('sell')"
          >SELL
        </n-button>
      </template>
    </trading-the-orderbook>
  </div>
</template>

<style scoped></style>
