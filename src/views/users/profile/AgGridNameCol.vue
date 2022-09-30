<script setup>
  defineProps(['params']);
</script>

<template>
  <div class="w-full flex flex-col space-y-1">
    <span class="font-bold">{{ params.data.name }}</span>
    <span class="text-sm text-gray-500">{{ params.data.description }}</span>
  </div>
</template>