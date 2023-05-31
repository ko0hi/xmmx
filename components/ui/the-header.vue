<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PreferencesForm from '~/components/preferences/preferences-form.vue'
import { h } from 'vue'

const dialog = useDialog()

const openPreferenceDialog = () => {
  dialog.info({
    title: 'Preferences',
    content: () => h(PreferencesForm),
    width: '80%',
  })
}
</script>

<template>
  <div class="p-6 bg-green-800 flex justify-between items-center">
    <div>
      <NuxtLink class="text-white text-lg font-bold font-sans" href="/">XMMX</NuxtLink>
    </div>
    <div>
      <nav>
        <div class="flex">
          <font-awesome-icon
            class="text-white cursor-pointer"
            :icon="['fas', 'gear']"
            @click="openPreferenceDialog"
          ></font-awesome-icon>
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped></style>
