<template>
  <n-config-provider preflight-style-disabled>
    <n-dialog-provider>
      <div class="flex flex-col m-5 p-5">
        <trading-formed-orderbook-list class="mb-5" />
        <trading-order-list exchange-id="binanceusdm" />
      </div>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script lang="ts" setup></script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
</style>
