<script setup lang="ts"></script>

<template>
  <div class="p-6 bg-green-800 flex justify-between items-center">
    <div>
      <NuxtLink class="text-white text-lg font-bold font-sans" href="/">XMMX</NuxtLink>
    </div>
    <div>
      <nav>
        <ul class="flex gap-10 font-sans">
          <li><a href="#" class="text-white">Home</a></li>
          <li><a href="#" class="text-white">About</a></li>
          <li><a href="#" class="text-white">Contact</a></li>
        </ul>
      </nav>
    </div>
  </div>
  <slot />
  <div class="p-6 bg-green-800 text-white text-center bottom-0">
    <p class="text-sm">&copy; 2023 Your Company. All rights reserved.</p>
  </div>
</template>

<style scoped></style>
