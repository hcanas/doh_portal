<script setup>
  defineProps(['params']);
</script>

<template>
  <div class="w-full flex items-center flex-wrap">
    <span v-for="office in params.value" class="text-xs bg-gray-100 m-1 p-1 rounded max-h-max">{{ office.short_name }}</span>
  </div>
</template>