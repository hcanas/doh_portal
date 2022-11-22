<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import FormLabel from '../../components/forms/Label.vue';
  import FormInputPassword from '../../components/forms/InputPassword.vue';
  import FormFieldError from '../../components/forms/FieldError.vue';
  
  const props = defineProps(['user_id', 'permission_id']);
  const emit = defineEmits(['cancel']);

  const router = useRouter();
  
  const form_data = ref({
    current_password: null,
    new_password: null,
    confirm_password: null,
  });

  const form_errors = ref({});
  
  const save = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/change_password`, form_data.value)
      .then(() => {
        Cookies.remove('auth_token', { domain: location.hostname });
        router.push('/login');
      })
      .catch(error => form_errors.value = error.response.data);
  };
</script>

<template>
  <card class="w-192">
    <card-header
      :icon="'fas fa-user-shield'"
      :label="'Change Password'"
      :actions="['save', 'cancel']"
      @save="save"
      @cancel="$emit('cancel')"
    />


  <div class="flex flex-col space-y-6">
    <div class="flex flex-col">
      <form-label :text="'Current Password'" />
      <form-input-password v-model:value="form_data.current_password" />
      <form-field-error v-if="form_errors.current_password" :text="form_errors.current_password[0]" />
    </div>

    <div class="flex flex-col">
      <form-label :text="'New Password'" />
      <form-input-password v-model:value="form_data.new_password" />
      <form-field-error v-if="form_errors.new_password" :text="form_errors.new_password[0]" />
    </div>

    <div class="flex flex-col">
      <form-label :text="'Confirm Password'" />
      <form-input-password v-model:value="form_data.confirm_password" />
      <form-field-error v-if="form_errors.confirm_password" :text="form_errors.confirm_password[0]" />
    </div>
  </div>
  </card>
</template>