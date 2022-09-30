<script setup>
  defineProps(['to', 'icon', 'label'])
</script>

<template>
  <router-link :to="to" class="text-gray-500 transition">
    <div class="flex items-center space-x-1">
      <i :class="icon" class="text-sm text-center" />
      <span>{{ label }}</span>
    </div>
  </router-link>
</template>

<style scoped>
  a.router-link-active,
  a:hover {
    @apply text-primary-600
  }
</style>