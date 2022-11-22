<script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  
  import TimeLog from './profile/TimeLog.vue';
  import Permissions from './profile/Permissions.vue';
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import Modal from '../../components/overlays/Modal.vue';
  import CustomForm from './Form.vue';
  import IDCard from './profile/IDCard.vue';
  
  const user = ref({
    data: null,
    show_form: false,
    show_id_cards: false,
  });
  
  const permissions_filter_text = ref('');
  
  await axios.get(`${import.meta.env.VITE_API_URL}/users/${useRoute().params.id}`)
  .then(response => user.value.data = response.data);
  
  const storage_url = import.meta.env.VITE_API_STORAGE_URL + '/photos';
  
  const updatedUser = new_user => {
    user.value.data = new_user;
    user.value.show_form = false;
  };

  const auth_permissions = JSON.parse(Cookies.get('auth_permissions') ?? '[]');

  const hasPermission = name => {
    const permission = auth_permissions.find(x => x.n === name);

    return Boolean(permission);
  };
</script>

<template>
  <div class="flex-grow flex flex-col">
    <div class="flex items-start space-x-12">
      <card class="flex-shrink-0 w-96 flex flex-col space-y-12">
        <div class="flex-shrink-0 w-44 h-44 bg-white mx-auto rounded-full shadow-lg overflow-hidden relative">
          <img :src="`${storage_url}/${user.data.avatar ?? 'placeholder.png'}`" :key="user.data.updated_at" class="w-full h-full">
        </div>
        
        <div class="flex flex-col space-y-6">
          <div class="flex justify-center items-center space-x-2">
            <button @click="user.show_form = true" class="text-gray-600 bg-gray-50 hover:text-white hover:bg-gray-600 px-4 py-1 rounded shadow transition">
              <div class="flex items-center space-x-1">
                <i class="fas fa-user-pen text-xs" />
                <span class="text-sm">Edit</span>
              </div>
            </button>
            <button @click="user.show_id_cards = true" class="text-gray-600 bg-gray-50 hover:text-white hover:bg-gray-600 px-4 py-1 rounded shadow transition">
              <div class="flex items-center space-x-1">
                <i class="fas fa-id-card text-xs" />
                <span class="text-sm">IDs</span>
              </div>
            </button>
            <!-- <button @click="" class="text-gray-600 bg-gray-50 hover:text-white hover:bg-red-600 px-4 py-1 rounded shadow transition">
              <div class="flex items-center space-x-1">
                <i class="fas fa-trash text-xs" />
                <span class="text-sm">Delete</span>
              </div>
            </button> -->
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Name</span>
            <span class="text-gray-600">{{ user.data.name }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Nickname</span>
            <span class="text-gray-600">{{ user.data.nickname ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Biometrics ID</span>
            <span class="text-gray-600">{{ user.data.biometrics_id ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Username</span>
            <span class="text-gray-600">{{ user.data.username ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Code</span>
            <span class="text-gray-600">{{ user.data.code ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Address</span>
            <span class="text-gray-600">{{ user.data.address ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Contact Number</span>
            <span class="text-gray-600">{{ user.data.contact_number ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Email</span>
            <span class="text-gray-600">{{ user.data.email ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Position</span>
            <span class="text-gray-600">{{ user.data.position ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Birthdate</span>
            <span class="text-gray-600">{{ user.data.birthdate ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Sex</span>
            <span class="text-gray-600">{{ user.data.sex ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Blood Type</span>
            <span class="text-gray-600">{{ user.data.blood_type ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">GSIS Number</span>
            <span class="text-gray-600">{{ user.data.gsis_number ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Pag-ibig Number</span>
            <span class="text-gray-600">{{ user.data.pagibig_number ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Philhealth Number</span>
            <span class="text-gray-600">{{ user.data.philhealth_number ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">TIN Number</span>
            <span class="text-gray-600">{{ user.data.tin_number ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Emergency Contact Name</span>
            <span class="text-gray-600">{{ user.data.emergency_contact_name ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Emergency Contact Number</span>
            <span class="text-gray-600">{{ user.data.emergency_contact_number ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Contract From</span>
            <span class="text-gray-600">{{ user.data.contract_from ?? '---' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase font-medium">Contract To</span>
            <span class="text-gray-600">{{ user.data.contract_to ?? '---' }}</span>
          </div>
        </div>
      </card>
      
      <div class="flex-grow flex flex-col space-y-12">
        <card>
          <card-header :icon="'fas fa-clock'" :label="'Time Log'" />
          <time-log :id="user.data.biometrics_id" :key="user.data.biometrics_id" />
        </card>
        
        <card v-if="hasPermission('user_permissions:manage')" class="space-y-0">
          <card-header
            class="mb-12"
            :icon="'fas fa-user-shield'"
            :label="'Permissions'"
            :actions="['search']"
            v-model:searchValue="permissions_filter_text"
          />
          
          <permissions
            :id="user.data.id"
            :filter_text="permissions_filter_text"
          />
        </card>
      </div>
    </div>
  </div>
  
  <modal :show="user.show_form">
    <custom-form
      :id="user.data.id"
      @updatedUser="updatedUser"
      @cancel="user.show_form = false"
    />
  </modal>
  
  <modal :show="user.show_id_cards">
    <IDCard
      v-if="user.data.id"
      :user="user.data"
      @close="user.show_id_cards = false"
    />
  </modal>
</template>