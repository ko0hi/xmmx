<script setup lang="ts">
import usePreferencesStore from '~/composables/usePreferencesStore'
import { storeToRefs } from 'pinia'
import useDiscordWebhook from '~/composables/useDiscordWebhook'
import useTradingPreferencesStore from '~/components/preferences/useTradingPreferencesStore'

const { discordWebhookUrl } = storeToRefs(usePreferencesStore())
const { disableOrderValidation, softAmountLimit, hardAmountLimit, softPriceLimit, hardPriceLimit } = storeToRefs(
  useTradingPreferencesStore()
)
const { post } = useDiscordWebhook()
</script>

<template>
  <n-form label-placement="left" label-width="100px">
    <p class="text-lg my-5">General</p>
    <n-form-item label="Discord Webhook">
      <div class="flex gap-5 items-center">
        <n-input type="password" v-model:value="discordWebhookUrl" show-password-on="click"></n-input>
        <n-button @click="post('Hello XMMX')" class="rounded-3xl">Test</n-button>
      </div>
    </n-form-item>
    <p class="text-lg mb-5">Trading</p>

    <n-form-item label="Soft Amount Limit">
      <n-input-number v-model:value="softAmountLimit" />
    </n-form-item>
    <n-form-item label="Hard Amount Limit">
      <n-input-number v-model:value="hardAmountLimit" />
    </n-form-item>
    <n-form-item label="Soft Price Limit (%)">
      <n-input-number v-model:value="softPriceLimit" :min="0" :max="100" :step="1" />
    </n-form-item>
    <n-form-item label="Hard Price Limit (%)">
      <n-input-number v-model:value="hardPriceLimit" :min="0" :max="100" :step="1" />
    </n-form-item>
    <n-form-item label="Disable Limits">
      <n-checkbox v-model:checked="disableOrderValidation" size="small"> </n-checkbox>
    </n-form-item>
  </n-form>
</template>

<style scoped></style>
