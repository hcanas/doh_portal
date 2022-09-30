<script setup>
  defineProps(['params']);
</script>

<template>
  <div class="w-full flex items-center space-x-4">
    <button @click="params.clicked({ action: 'edit', id: params.data.id })" class="text-gray-600 hover:text-blue-600">
      <i class="fas fa-pencil text-xs" />
    </button>
    <button @click="params.clicked({ action: 'delete', id: params.data.id })" class="text-gray-600 hover:text-red-600">
      <i class="fas fa-trash text-xs" />
    </button>
  </div>
</template>