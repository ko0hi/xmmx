<template>
  <div class="flex flex-col m-5 p-5">
    <trading-formed-orderbook-list class="mb-5" />
    <trading-order-list exchange-id="binanceusdm" />
  </div>
</template>

<script lang="ts" setup>
import useDiscordWebhook from '~/composables/useDiscordWebhook'
import { onMounted } from 'vue'

const { post } = useDiscordWebhook()

onMounted(async () => {
  await post('Hello world')
})
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
</style>
