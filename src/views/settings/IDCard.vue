<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  
  const props = defineProps(['user']);
  defineEmits(['close']);
  
  const storage_url = import.meta.env.VITE_API_STORAGE_URL;
  const ids = ref([]);
  const status = ref({
    jc_front_loaded: false,
    jc_back_loaded: false,
    reg_front_loaded: false,
    reg_back_loaded: false,
  });
  
  await onMounted(async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}/id_cards/${props.user.id}`)
      .then(response => ids.value = response.data)
      .catch(() => {});
  });
</script>

<template>
  <card class="w-full h-full flex flex-col space-y-12 p-12 overflow-y-auto">
    <card-header
      :icon="'fas fa-id-card'"
      :label="'ID Cards'"
      :actions="['close']"
      @close="$emit('close')"
    />
    
    <div class="flex items-center space-x-12">
      <div class="w-1/2">
        <img :src="`${storage_url}/cards/${ids.jc_front}`" @load="status.jc_front_loaded = true" :class="{ 'hidden': status.jc_front_loaded === false }" class="transition" />
        
        <div :class="{ 'hidden': status.jc_front_loaded }" class="animate-pulse w-full h-96 flex justify-center items-center bg-gray-400 border rounded-lg transition">
          <div class="flex items-center space-x-2">
            <i class="fas fa-spinner text-gray-600 animate-spin" />
            <span class="text-gray-600 uppercase font-medium">Loading Image</span>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <img :src="`${storage_url}/cards/${ids.jc_back}`" @load="status.jc_back_loaded = true" :class="{ 'hidden': status.jc_back_loaded === false }" />

        <div :class="{ 'hidden': status.jc_back_loaded }" class="animate-pulse w-full h-96 flex justify-center items-center bg-gray-400 border rounded-lg">
          <div class="flex items-center space-x-2">
            <i class="fas fa-spinner text-gray-600 animate-spin" />
            <span class="text-gray-600 uppercase font-medium">Loading Image</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-12">
      <div class="w-1/2">
        <img :src="`${storage_url}/cards/${ids.reg_front}`" @load="status.reg_front_loaded = true" :class="{ 'hidden': status.reg_front_loaded === false }" />

        <div :class="{ 'hidden': status.reg_front_loaded }" class="animate-pulse w-full h-96 flex justify-center items-center bg-gray-400 border rounded-lg">
          <div class="flex items-center space-x-2">
            <i class="fas fa-spinner text-gray-600 animate-spin" />
            <span class="text-gray-600 uppercase font-medium">Loading Image</span>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <img :src="`${storage_url}/cards/${ids.reg_back}`" @load="status.reg_back_loaded = true" :class="{ 'hidden': status.reg_back_loaded === false }" />

        <div :class="{ 'hidden': status.reg_back_loaded }" class="animate-pulse w-full h-96 flex justify-center items-center bg-gray-400 border rounded-lg">
          <div class="flex items-center space-x-2">
            <i class="fas fa-spinner text-gray-600 animate-spin" />
            <span class="text-gray-600 uppercase font-medium">Loading Image</span>
          </div>
        </div>
      </div>
    </div>
  </card>
</template>