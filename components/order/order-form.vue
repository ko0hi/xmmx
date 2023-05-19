<script setup lang="ts">
import useCurrencyIcon from '~/composables/useCurrencyIcon'
import useOrderForm from '~/composables/useOrderForm'
import { useDialog, useDialogReactiveList } from 'naive-ui'
import OrderSummary from '~/components/order/order-summary.vue'

const props = defineProps<{
  exchangeId: string
  symbol: string
  side?: 'BUY' | 'SELL'
  type?: 'limit' | 'market' | 'stopLimit' | 'stopMarket'
  price?: number
  size?: number
}>()

const {
  exchangeId,
  symbol,
  side,
  type,
  size,
  price,
  triggerPrice,
  reduceOnly,
  postOnly,
  requiredFields,
  isRequiredFieldsFilled,
  exchangeSelectOptionsForNaiveUi,
  symbolSelectOptionsForNaiveUi,
  tickSize,
  lotSize,
} = useOrderForm({
  exchangeId: props.exchangeId,
  symbol: props.symbol,
  side: props.side,
  type: props.type,
  price: props.price,
  size: props.size,
})

const slotArgs = computed(() => ({
  exchange: exchangeId.value,
  symbol: symbol.value,
  side: side.value,
  type: type.value,
  size: size.value,
  price: price.value,
  triggerPrice: triggerPrice.value,
  reduceOnly: reduceOnly.value,
  postOnly: postOnly.value,
}))

const dialog = useDialog()

const onSubmit = async (s: string) => {
  side.value = s

  dialog.info({
    title: 'Confirm order',
    content: () =>
      h(
        OrderSummary,
        {
          exchangeId: exchangeId.value,
          params: {
            symbol: symbol.value,
            side: side.value,
            type: type.value,
            amount: size.value,
            price: price.value,
            triggerPrice: triggerPrice.value,
            reduceOnly: reduceOnly.value,
            postOnly: postOnly.value,
          },
        },
        ''
      ),
    positiveText: 'Order',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      console.log(useDialogReactiveList())

      const { client } = useCcxtClient(exchangeId)
      await client.value.order({
        symbol: symbol.value,
        type: type.value,
        side: side.value,
        amount: size.value,
        price: price.value,
        triggerPrice: triggerPrice.value,
        reduceOnly: reduceOnly.value,
        postOnly: postOnly.value,
      })
      dialog.destroyAll()
    },
    onNegativeClick: async () => {
      dialog.destroyAll()
    },
    onClose: () => {
      dialog.destroyAll()
    },
  })
}
</script>

<template>
  <n-form label-placement="left" label-align="right" label-width="100">
    <slot name="exchange" :config="slotArgs">
      <n-form-item label="Exchange">
        <n-select v-model:value="exchangeId" :options="exchangeSelectOptionsForNaiveUi" filterable />
      </n-form-item>
    </slot>
    <slot name="symbol" :config="slotArgs">
      <n-form-item label="Symbol">
        <n-select
          v-model:value="symbol"
          :options="symbolSelectOptionsForNaiveUi"
          :render-label="
            option =>
              h('div', { class: 'flex items-center gap-2' }, [
                h('img', { src: useCurrencyIcon(option.label).iconPath, class: 'w-3' }),
                h('span', {}, option.label),
              ])
          "
          filterable
        />
      </n-form-item>
    </slot>
    <slot name="type" :config="slotArgs">
      <n-form-item label="Type">
        <n-select
          v-model:value="type"
          :options="[
            { label: 'Limit', value: 'limit' },
            { label: 'Market', value: 'market' },
            { label: 'StopLimit', value: 'stopLimit' },
            { label: 'StopMarket', value: 'stopMarket' },
          ]"
          filterable
        />
      </n-form-item>
    </slot>
    <slot name="price" :config="slotArgs">
      <n-form-item v-if="requiredFields.includes('price')" label="Price">
        <n-input-number v-model:value="price" :step="tickSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="size" :config="slotArgs">
      <n-form-item v-if="requiredFields.includes('size')" label="Size">
        <n-input-number v-model:value="size" :step="lotSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="triggerPrice" :config="slotArgs">
      <n-form-item v-if="requiredFields.includes('triggerPrice')" label="Trigger Price">
        <n-input-number v-model:value="triggerPrice" :step="tickSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="reduceOnly" :config="slotArgs">
      <n-form-item label="Reduce Only">
        <n-checkbox v-model:checked="reduceOnly" />
      </n-form-item>
    </slot>
    <slot name="postOnly" :config="slotArgs">
      <n-form-item v-if="type === 'limit' || type === 'stopLimit'" label="Post Only">
        <n-checkbox v-model:checked="postOnly" />
      </n-form-item>
    </slot>
    <div class="flex justify-center gap-5">
      <n-button
        class="rounded-md"
        size="large"
        type="success"
        :disabled="!isRequiredFieldsFilled"
        @click="onSubmit('buy')"
        >BUY
      </n-button>
      <n-button
        class="rounded-md"
        size="large"
        type="error"
        :disabled="!isRequiredFieldsFilled"
        @click="onSubmit('sell')"
        >SELL
      </n-button>
    </div>
  </n-form>
</template>
