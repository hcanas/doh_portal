<script setup>
  defineProps(['icon', 'label', 'actions', 'searchValue']);
  defineEmits(['create', 'save', 'cancel', 'close', 'update:searchValue'])
</script>

<template>
  <div class="flex justify-between items-baseline">
    <div class="flex items-center space-x-1 text-gray-600 font-medium">
      <i :class="icon" />
      <span>{{ label }}</span>
    </div>
    <div v-if="actions" class="flex items-center space-x-4">
      <input v-if="actions.includes('search')" type="search" @input="$emit('update:searchValue', $event.target.value)" class="text-sm px-2 py-1 border rounded" placeholder="Search..." />
      <button v-if="actions.includes('cancel')" @click="$emit('cancel')" class="text-sm text-gray-600 hover:bg-gray-100 px-4 py-1 rounded">
        <div class="flex items-center space-x-2">
          <i class="fas fa-xmark" />
          <span>Cancel</span>
        </div>
      </button>
      <button v-if="actions.includes('close')" @click="$emit('close')" class="text-sm text-gray-600 hover:bg-gray-100 px-4 py-1 rounded">
        <div class="flex items-center space-x-2">
          <i class="fas fa-xmark" />
          <span>Close</span>
        </div>
      </button>
      <button v-if="actions.includes('save')" @click="$emit('save')" class="text-sm text-white bg-green-600 hover:bg-green-500 px-4 py-1 rounded">
        <div class="flex items-center space-x-2">
          <i class="fas fa-save" />
          <span>Save</span>
        </div>
      </button>
      <button v-if="actions.includes('create')" @click="$emit('create')" class="text-sm text-white bg-green-600 hover:bg-green-500 px-4 py-1 rounded">
        <div class="flex items-center space-x-2">
          <slot name="icon_create">
            <i class="fas fa-plus" />
          </slot>
          <slot name="text_create">
            <span>Create</span>
          </slot>
        </div>
      </button>
    </div>
  </div>
</template>