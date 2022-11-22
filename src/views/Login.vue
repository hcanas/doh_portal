<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  
  const router = useRouter();
  
  const form_data = ref({
    username: '',
    password: '',
  });
  
  const status = ref('');
  
  const login = async () => {
    status.value = 'authenticating';
    
    await axios.post(`${import.meta.env.VITE_API_URL}/login`, form_data.value)
    .then(response => {
      Cookies.set('auth_token', response.data, { expires: 1/3, domain: location.hostname }); // expires in 8 hours
      router.push('/');
    })
    .catch(() => status.value = 'error');
  };
</script>

<template>
  <div class="w-full xl:w-2/3 h-full flex xl:mx-auto xl:p-12">
    <div class="w-1/2 h-full bg-white rounded-l-2xl shadow-lg">
      <div class="h-full flex flex-col space-y-8 xl:space-y-24 p-8 xl:p-12 overflow-y-auto">
        <div class="flex justify-center items-center space-x-2">
          <img src="/images/DOH-Logo.png" class="flex-shrink-0 w-16 xl:w-20">
          <div class="flex-shrink-0">
            <p class="text-xs border-b leading-4">Republic of the Philippines</p>
            <p class="text-xs xl:text-base uppercase font-bold leading-4">Department of Health</p>
            <p class="text-xs xl:text-sm uppercase font-medium leading-4">Center for Health Development</p>
            <p class="text-xs uppercase italic leading-4">Cordillera Administrative Region</p>
          </div>
        </div>
        
        <div class="flex flex-col space-y-6 xl:space-y-12">
          <div class="flex flex-col">
            <h3 class="text-sm uppercase font-bold border-b">Vision</h3>
            <p class="text-sm">Filipinos are among the healthiest people in Southeast Asia by 2022 and Asia by 2040.</p>
          </div>
          
          <div class="flex flex-col">
            <h3 class="text-sm uppercase font-bold border-b">Mission</h3>
            <p class="text-sm">To lead the country in the development of a productive, resilient, equitable, and people-centered health system.</p>
          </div>
          
          <div class="flex flex-col">
            <h3 class="text-sm uppercase font-bold border-b">The DOH Quality Policy</h3>
            <p class="text-sm">The Department of Health, as the nation’s leader in health, is committed to nurturing Filipinos to be
              amongst the healthiest in Southeast Asia by 2022 and Asia by 2040 through the development of a productive, resilient, equitable,
              and people-centered health system.
  
              We at the DOH, together with our partners, are committed to implementing standards and policies to ensure the highest
              quality of health services to the satisfaction of our clients.  We observe zero-tolerance against corruption, comply
              with statutory requirements, and continually improve our quality management systems as we provide public service with
              integrity, excellence, and compassion.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="w-1/2 h-full bg-green-600 rounded-r-2xl shadow-lg">
      <div class="h-full flex flex-col justify-center items-center space-y-12 p-12">
        <h1 class="text-4xl text-white uppercase font-bold">Portal</h1>
        
        <form class="w-full xl:w-2/3" @submit.prevent>
          <div class="flex flex-col space-y-6">
            <div v-if="status === 'error'" class="bg-red-100 p-2 rounded">
              <p class="text-sm text-red-600"> incorrect username or password</p>
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-xs text-white uppercase font-medium">Username</label>
              <input type="text" v-model="form_data.username" class="text-sm text-center bg-white px-4 py-2 rounded outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-xs text-white uppercase font-medium">Password</label>
              <input type="password" v-model="form_data.password" class="text-sm text-center bg-white px-4 py-2 rounded outline-none" />
            </div>
            <div class="flex flex=col">
              <button @click="login" class="w-full bg-white rounded px-4 py-2 hover:bg-gray-100">
                <div v-if="status !== 'authenticating'" class="flex justify-center items-center space-x-2">
                  <i class="fas fa-arrow-right text-sm text-gray-600" />
                  <span class="text-sm text-gray-600 font-medium uppercase">Sign In</span>
                </div>
                <div v-else class="flex justify-center items-center space-x-2 animate-pulse">
                  <i class="fas fa-spinner text-sm text-gray-600 animate-spin" />
                  <span class="text-sm text-gray-600 font-medium uppercase">Signing in</span>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>