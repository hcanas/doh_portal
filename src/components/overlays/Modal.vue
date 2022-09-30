<script setup>
  defineProps(['show']);
</script>

<template>
  <transition>
    <div v-if="show" class="absolute inset-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 p-12 z-50">
      <slot></slot>
    </div>
  </transition>
</template>

<style scoped>
  #modal {
    @apply absolute
    inset-0
    p-12
    z-50
    overflow-hidden
    bg-gray-900
    flex justify-center items-center
    bg-opacity-50
  }

  .v-enter-active,
  .v-leave-active {
    @apply transition-all duration-200
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>