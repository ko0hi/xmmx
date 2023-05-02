<script setup lang="ts">
import { computed, CSSProperties, ref } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'

type OrderbookProps = {
  modelValue: { exchangeId: string; exchangeOptions: object; symbol: string }
  exchangeId: string
  symbol: string
  interval: number
  limit?: number
  round?: number
  exchangeOptions?: object
}

const props = withDefaults(defineProps<OrderbookProps>(), {
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

const { listAvailableMarkets } = useCcxtClient(exchangeId, exchangeOptions)
const options = computed(() => listAvailableMarkets().map(item => ({ label: item, value: item })))
const clicked = ref()
watch(exchangeId, () => (symbol.value = listAvailableMarkets()[0]))

const emit = defineEmits<{
  (event: 'update:modelValue', value: { exchangeId: string; exchangeOptions: object; symbol: string }): void
}>()

watch([clicked], () => {
  emit('update:modelValue', clicked.value)
})

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
        <n-select v-model:value="symbol" :options="options" filterable />
      </n-form-item>
      <n-form-item class="my-2" label="Display" :label-style="labelStyle">
        <n-radio-group v-model:value="limit">
          <n-radio v-for="(item, index) in [5, 10, 30, 50]" :key="index" :value="item" :label="item.toString()" />
        </n-radio-group>
      </n-form-item>
      <n-form-item class="my-2" label="Round" :label-style="labelStyle">
        <n-input-number v-model:value="round" :min="0" clearable />
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
    />
  </div>
</template>

<style scoped></style>
