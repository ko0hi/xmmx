<script lang="ts" setup>
import { ref } from 'vue'

const a = ref()
</script>

<template>
  <div class="flex flex-col m-5 p-5">
    <trading-formed-orderbook-list class="mb-5" ref="a" />
    <trading-order-list exchange-id="binanceusdm" v-if="a" />
  </div>
</template>
<style>
* {
  margin: 0px;
  padding: 0px;
}
</style>
