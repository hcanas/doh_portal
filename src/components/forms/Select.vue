<script setup>
  defineProps(['value', 'options']);
  defineEmits(['update:value']);
</script>

<template>
  <select :value="value" @change="$emit('update:value', $event.target.value)" class="px-2 py-1 border rounded-lg">
    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
  </select>
</template>