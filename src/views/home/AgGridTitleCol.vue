<script setup>
  defineProps(['params']);
</script>

<template>
  <div class="w-full flex flex-col space-y-1 leading-normal">
    <span class="text-gray-600 text-sm uppercase font-bold">{{ params.data.title }}</span>
    <span class="text-gray-500 text-sm">{{ params.data.description }}</span>
    <span class="text-xs text-gray-400 uppercase flex items-center space-x-4">{{ new Date(params.data.created_at).toLocaleString() }}</span>
  </div>
</template>