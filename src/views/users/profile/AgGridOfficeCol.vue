<script setup>
  defineProps(['params']);
</script>

<template>
  <div class="w-full flex items-center flex-wrap">
    <span v-for="office in params.value" class="text-xs bg-gray-100 m-1 p-1 rounded max-h-max">{{ office.short_name }}</span>
    <span class="w-auto">
      <button @click="params.clicked(params.data.id)" class="text-green-600 hover:text-green-500 px-2 py-0.5 rounded">
        <i class="fas fa-pencil text-xs" />
      </button>
    </span>
  </div>
</template>