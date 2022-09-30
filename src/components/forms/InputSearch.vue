<script setup>
  defineProps(['value']);
  defineEmits(['update:value']);
</script>

<template>
  <input type="search" :value="value" @input="$emit('update:value', $event.target.value)" class="text-gray-600 px-2 py-1 border rounded-lg" />
</template>