<script lang="ts" setup>
import { OrderbookSidebysideWithForm } from '#components'

const orderbookComponent = shallowRef(OrderbookSidebysideWithForm)
const orderbookList = ref([])
const config = ref()

const onAdd = () => {
  orderbookList.value.push({ component: orderbookComponent, key: new Date().getTime() })
}

const onDeleteButtonClick = key => {
  orderbookList.value = orderbookList.value.filter(item => item.key !== key)
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-5">
      <div v-for="orderbook in orderbookList" :key="orderbook.key">
        <div class="flex justify-end m-0 p-0">
          <n-button quaternary circle size="small" @click="onDeleteButtonClick(orderbook.key)"
            ><span class="text-xs">✖</span>︎</n-button
          >
        </div>
        <component :is="orderbook.component" v-model="config" class="-mt-1" />
      </div>
      <div class="flex m-5 w-48 h-64 items-center justify-center">
        <n-button circle @click="onAdd">+</n-button>
      </div>
    </div>
    {{ config }}
  </div>
</template>
