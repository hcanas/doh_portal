<script setup>
  defineProps(['params']);
  
  const storage_url = import.meta.env.VITE_API_STORAGE_URL + '/photos';
</script>

<template>
  <router-link :to="`/users/${params.data.id}`" class="w-full h-full flex items-center space-x-4">
    <span class="flex-shrink-0 w-20 h-20 flex justify-center items-center rounded-full shadow-lg overflow-hidden">
      <img :src="`${storage_url}/${params.data.avatar ?? 'placeholder.png'}`" />
    </span>
    <span class="flex-grow grid grid-cols-5 gap-2 text-gray-600 leading-6">
      <span class="flex flex-col justify-center">
        <span v-if="params.data.biometrics_id" class="flex items-center space-x-1 text-gray-500">
          <i class="fas fa-fingerprint" />
          <span>{{ params.data.biometrics_id }}</span>
        </span>
        <span class="font-bold">{{ params.data.name }}</span>
        <span v-if="params.data.nickname" class="text-gray-500 italic">{{ `"${params.data.nickname}"` }}</span>
        <span>{{ params.data.code }}</span>
      </span>
      
      <span class="flex flex-col space-y-1">
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Username</span>
          <span>{{ params.data.username ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Address</span>
          <span>{{ params.data.address ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Contact Number</span>
          <span>{{ params.data.contact_number ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Email</span>
          <span>{{ params.data.email ?? '---' }}</span>
        </span>
      </span>
      
      <span class="flex flex-col space-y-1">
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Position</span>
          <span>{{ params.data.position ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Birthdate</span>
          <span>{{ params.data.birthdate ? new Date(params.data.birthdate).toLocaleDateString() : '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Sex</span>
          <span>{{ params.data.sex ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Blood Type</span>
          <span>{{ params.data.blood_type ?? '---' }}</span>
        </span>
      </span>
      
      <span class="flex flex-col space-y-1">
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">GSIS Number</span>
          <span>{{ params.data.gsis_number ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Pag-ibig Number</span>
          <span>{{ params.data.pagibig_number ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Philhealth Number</span>
          <span>{{ params.data.philhealth_number ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">TIN Number</span>
          <span>{{ params.data.tin_number ?? '---' }}</span>
        </span>
      </span>
      
      <span class="flex flex-col space-y-1">
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Emergency Contact Name</span>
          <span>{{ params.data.emergency_contact_name ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Emergency Contact Number</span>
          <span>{{ params.data.emergency_contact_number ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Contract From</span>
          <span>{{ params.data.contract_from ?? '---' }}</span>
        </span>
        <span class="flex flex-col">
          <span class="text-xs text-gray-400 uppercase font-bold">Contract To</span>
          <span>{{ params.data.contract_to ?? '---' }}</span>
        </span>
      </span>
    </span>
  </router-link>
</template>