<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import FormLabel from '../../components/forms/Label.vue';
  import FormInputText from '../../components/forms/InputText.vue';
  import FormInputNumber from '../../components/forms/InputNumber.vue';
  import FormInputPassword from '../../components/forms/InputPassword.vue';
  import FormInputDate from '../../components/forms/InputDate.vue';
  import FormSelect from '../../components/forms/Select.vue';
  import FormFieldError from '../../components/forms/FieldError.vue';
  
  const props = defineProps(['id']);
  const emit = defineEmits(['createdUser', 'updatedUser', 'cancel']);
  const storage_url = import.meta.env.VITE_API_STORAGE_URL + '/photos';
  const input_ref_avatar = ref(null);
  
  const form_data = ref({
    id: null,
    biometrics_id: null,
    code: '',
    name: '',
    nickname: '',
    address: '',
    email: '',
    position: '',
    birthdate: '',
    sex: '',
    blood_type: '',
    gsis_number: '',
    philhealth_number: '',
    tin_number: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    contract_from: '',
    contract_to: '',
    username: '',
    password: '',
  });
  
  const form_options = ref({
    sexes: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
    ],
    avatar: {
      current: null,
      replacement: null,
      preview: '',
    },
  });
  
  const form_errors = ref({});
  
  await onMounted(async () => {
    if (props.id) {
      await axios.get(`${import.meta.env.VITE_API_URL}/users/${props.id}`)
        .then(response => {
          Object.keys(form_data.value).forEach(key => {
            if (response.data.hasOwnProperty(key)) {
              form_data.value[key] = response.data[key];
            }
          });
          
          form_options.value.avatar.current = response.data.avatar;
        });
    }
    form_options.value.avatar.preview = storage_url + '/' + (form_options.value.avatar.current ?? 'placeholder.png');
  });

  const saveUser = () => {
    const post_data = new FormData();
    
    Object.keys(form_data.value).forEach(key => post_data.append(key, form_data.value[key] ?? ''));
    
    if (form_options.value.avatar.replacement) {
      post_data.append('avatar', form_options.value.avatar.replacement);
    }
    
    if (form_data.value.id) {
      post_data.append('_method', 'PUT');
      
      axios.post(`${import.meta.env.VITE_API_URL}/users/${form_data.value.id}`, post_data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => emit('updatedUser', response.data))
        .catch(error => {
          if (error.response.status === 400) {
            form_errors.value = error.response.data;
          }
        });
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/users`, post_data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => emit('createdUser', response.data))
        .catch(error => {
          if (error.response.status === 400) {
            form_errors.value = error.response.data;
          }
        });
    }
  };
  
  const avatarChanged = event => {
    form_options.value.avatar.replacement = event.target.files[0];
    form_options.value.avatar.preview = URL.createObjectURL(event.target.files[0]);
  };
  
  const removeAvatar = () => {
    form_data.value.remove_avatar = true;
    form_options.value.avatar.preview = storage_url + '/placeholder.png';
  };
  
  const resetAvatar = () => {
    input_ref_avatar.value.value = null;
    form_options.value.avatar.replacement = null;
    form_options.value.avatar.preview = storage_url + '/' + (form_options.value.avatar.current ?? 'placeholder.png');
  };
</script>

<template>
  <card class="w-5/6 max-h-full overflow-y-auto">
    <card-header
      :icon="form_data.id ? 'fas fa-user-pen' : 'fas fa-user-plus'"
      :label="form_data.id ? 'Update User' : 'Create User'"
      :actions="['save', 'cancel']"
      @save="saveUser"
      @cancel="$emit('cancel')"
    />
    
    <form @submit.prevent class="flex items-start space-x-6">
      <div class="w-1/3 flex flex-col space-y-6">
        <div class="relative">
          <div class="absolute top-0 right-0 flex items-center space-x-4">
            <button v-if="form_options.avatar.current && form_options.avatar.replacement === null" @click="removeAvatar" class="text-gray-500 hover:text-gray-600" title="Remove">
              <i class="fas fa-trash" />
            </button>
            <button v-if="form_options.avatar.replacement" @click="resetAvatar" class="text-gray-500 hover:text-gray-600" title="Reset">
              <i class="fas fa-rotate-left" />
            </button>
            <label class="text-gray-500 hover:text-gray-600 cursor-pointer" title="Upload">
              <i class="fas fa-camera" />
              <input type="file" class="hidden" ref="input_ref_avatar" @change="avatarChanged" />
            </label>
          </div>
          <img :src="form_options.avatar.preview" />
        </div>

        <div class="flex flex-col space-y-1">
          <form-label :text="'Name'" />
          <form-input-text v-model:value="form_data.name" />
          <form-field-error v-if="form_errors.name" :text="form_errors.name[0]" />
        </div>
        <div class="flex flex-col space-y-1">
          <form-label :text="'Nickname'" />
          <form-input-text v-model:value="form_data.nickname" />
          <form-field-error v-if="form_errors.nickname" :text="form_errors.nickname[0]" />
        </div>
        
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Biometrics ID'" />
            <form-input-number v-model:value="form_data.biometrics_id" />
            <form-field-error v-if="form_errors.biometrics_id" :text="form_errors.biometrics_id[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Code'" />
            <form-input-text v-model:value="form_data.code" />
            <form-field-error v-if="form_errors.code" :text="form_errors.code[0]" />
          </div>
        </div>
      </div>
      <div class="w-2/3 flex flex-col space-y-6">
        <div class="flex flex-col space-y-1">
          <form-label :text="'Address'" />
          <form-input-text v-model:value="form_data.address" />
          <form-field-error v-if="form_errors.address" :text="form_errors.address[0]" />
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Contact Number'" />
            <form-input-text v-model:value="form_data.contact_number" />
            <form-field-error v-if="form_errors.contact_number" :text="form_errors.contact_number[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Email'" />
            <form-input-text v-model:value="form_data.email" />
            <form-field-error v-if="form_errors.email" :text="form_errors.email[0]" />
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Position'" />
            <form-input-text v-model:value="form_data.position" />
          <form-field-error v-if="form_errors.position" :text="form_errors.position[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Birthdate'" />
            <form-input-date v-model:value="form_data.birthdate" />
          <form-field-error v-if="form_errors.birthdate" :text="form_errors.birthdate[0]" />
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Sex'" />
            <form-select v-model:value="form_data.sex" :options="form_options.sexes" />
          <form-field-error v-if="form_errors.sex" :text="form_errors.sex[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Blood Type'" />
            <form-input-text v-model:value="form_data.blood_type" />
          <form-field-error v-if="form_errors.blood_type" :text="form_errors.blood_type[0]" />
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'GSIS Number'" />
            <form-input-text v-model:value="form_data.gsis_number" />
          <form-field-error v-if="form_errors.gsis_number" :text="form_errors.gsis_number[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Pag-ibig Number'" />
            <form-input-text v-model:value="form_data.pagibig_number" />
          <form-field-error v-if="form_errors.pagibig_number" :text="form_errors.pagibig_number[0]" />
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Philhealth Number'" />
            <form-input-text v-model:value="form_data.philhealth_number" />
          <form-field-error v-if="form_errors.philhealth_number" :text="form_errors.philhealth_number[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'TIN Number'" />
            <form-input-text v-model:value="form_data.tin_number" />
          <form-field-error v-if="form_errors.tin_number" :text="form_errors.tin_number[0]" />
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Emergency Contact Name'" />
            <form-input-text v-model:value="form_data.emergency_contact_name" />
          <form-field-error v-if="form_errors.emergency_contact_name" :text="form_errors.emergency_contact_name[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Emergency Contact Number'" />
            <form-input-text v-model:value="form_data.emergency_contact_number" />
          <form-field-error v-if="form_errors.emergency_contact_number" :text="form_errors.emergency_contact_number[0]" />
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Contract From'" />
            <form-input-date v-model:value="form_data.contract_from" />
          <form-field-error v-if="form_errors.contract_from" :text="form_errors.contract_from[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Contract To'" />
            <form-input-date v-model:value="form_data.contract_to" />
          <form-field-error v-if="form_errors.contract_to" :text="form_errors.contract_to[0]" />
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Username'" />
            <form-input-text v-model:value="form_data.username" />
          <form-field-error v-if="form_errors.username" :text="form_errors.username[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Password'" />
            <form-input-password v-model:value="form_data.password" />
          <form-field-error v-if="form_errors.password" :text="form_errors.password[0]" />
          </div>
        </div>
      </div>
    </form>
  </card>
</template>