<script setup>
  import { DatePicker } from 'v-calendar';
  
  const props = defineProps(['value']);
  const emit = defineEmits(['update:value']);
</script>

<template>
  <date-picker class="w-full h-full" :modelValue="value" @update:modelValue="val => $emit('update:value', val?.toLocaleString())" mode="date" :model-config="{ type: 'string', mask: 'YYYY-MM-DD' }" :masks="{ L: 'YYYY-MM-DD' }">
    <template v-slot="{ inputValue, togglePopover }">
      <input type="text" @click="togglePopover" :value="inputValue" class="w-full text-gray-600 px-2 py-1 border rounded-lg" readonly />
    </template>
  </date-picker>
</template>