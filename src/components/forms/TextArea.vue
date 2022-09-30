<script setup>
  defineProps(['value']);
  defineEmits(['update:value']);
</script>

<template>
  <textarea :value="value" @input="$emit('update:value', $event.target.value)" class="h-96 px-2 py-1 border rounded-lg"></textarea>
</template>