<script setup lang="ts">
import usePreferencesStore from '~/composables/usePreferencesStore'
import { storeToRefs } from 'pinia'
import useDiscordWebhook from '~/composables/useDiscordWebhook'

const { discordWebhookUrl } = storeToRefs(usePreferencesStore())
const { post } = useDiscordWebhook()
</script>

<template>
  <n-form label-placement="left">
    <n-form-item label="Discord Webhook">
      <div class="flex gap-5 items-center">
        <n-input type="password" v-model:value="discordWebhookUrl" show-password-on="click"></n-input>
        <n-button @click="post('Hello XMMX')" class="rounded-3xl">Test</n-button>
      </div>
    </n-form-item>
  </n-form>
</template>

<style scoped></style>
