<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { DatePicker } from 'v-calendar';
  
  const props = defineProps(['value']);
  const emit = defineEmits(['update:value']);
  
  const date = ref(null);
  
  onMounted(() => {
    date.value = props.value;
    
    watch(() => date.value, new_val => emit('update:value', new_val.toLocaleDateString()));
  });
</script>

<template>
  <date-picker class="w-full h-full" v-model="date">
    <template v-slot="{ inputValue, togglePopover }">
      <input type="text" @click="togglePopover" :value="inputValue" class="w-full text-gray-600 px-2 py-1 border rounded-lg" readonly />
    </template>
  </date-picker>
</template>