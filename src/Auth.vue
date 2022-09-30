<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Cookies from 'js-cookie';
  
  import MenuItem from './components/nav/Item.vue';
  
  const user = JSON.parse(Cookies.get('auth_user', { domain: 'dohchdcar.local' }));
  const router = useRouter();
  const show_user_menu = ref(false);

  const storage_url = import.meta.env.VITE_API_STORAGE_URL + '/photos';

  const toggleUserMenu = () => show_user_menu.value = !show_user_menu.value;
  
  const logout = () => {
    Cookies.remove('auth_token', { domain: 'dohchdcar.local' });
    router.push('/login');
  };
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-shrink-0 flex justify-between items-stretch bg-white px-12 shadow z-10">
      <div class="flex-shrink-0 flex justify-center items-baseline py-4">
        <span class="text-2xl text-gray-600 font-medium">P</span>
        <img src="/images/DOH-Logo.png" class="flex-shrink-0 w-5">
        <span class="text-2xl text-gray-600 font-medium">RTAL</span>
      </div>
      
      <div class="flex items-center space-x-8">
        <menu-item :to="'/'" :icon="'fas fa-home'" :label="'Home'" />
        <menu-item :to="'/users'" :icon="'fas fa-users'" :label="'Users'" />
        <menu-item :to="'/permissions'" :icon="'fas fa-shield-halved'" :label="'Permissions'" />
        <menu-item :to="'/offices'" :icon="'fas fa-building'" :label="'Offices'" />
      </div>
      
      <div class="flex items-center space-x-2 relative">
        <div class="flex items-center space-x-2">
          <div class="w-7 h-7 bg-white rounded-full shadow-lg overflow-hidden">
            <img :src="`${storage_url}/${user.avatar ?? 'placeholder.png'}`" />
          </div>
        </div>
        
        <button @click="toggleUserMenu" class="text-gray-600 hover:text-green-600">
          <i :class="`fas ${show_user_menu ? 'fa-xmark' : 'fa-caret-down'}`" />
        </button>
        
        <div :class="{ 'hidden': !show_user_menu }" class="absolute top-4 right-4 w-80 flex flex-col bg-white border rounded-lg shadow z-10">
          <div class="flex items-center space-x-4 bg-green-600 border-x border-x-green-600 p-4 rounded-t">
            <div class="w-10 h-10 bg-white rounded-full shadow-lg overflow-hidden">
              <img :src="`${storage_url}/${user.avatar ?? 'placeholder.png'}`" />
            </div>
            <span class="text-sm text-white font-medium">{{ user.name }}</span>
          </div>
          <div class="flex flex-col space-y-4 px-4 py-4">
            <router-link to="/settings" class="text-sm text-gray-600 hover:text-green-600">
              <div class="flex items-center space-x-2">
                <i class="fas fa-cog" />
                <span>Settings</span>
              </div>
            </router-link>
            <button @click="logout" class="text-sm text-gray-600 hover:text-green-600">
              <div class="flex items-center space-x-2">
                <i class="fas fa-door-open" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex-grow p-12 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>