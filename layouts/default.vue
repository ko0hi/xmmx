<template>
  <n-config-provider preflight-style-disabled>
    <n-message-provider>
      <n-dialog-provider>
        <ui-the-header />
        <slot />
        <div class="p-6 bg-green-800 text-white text-center bottom-0">
          <p class="text-sm">&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
