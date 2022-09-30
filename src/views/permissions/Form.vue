<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import FormLabel from '../../components/forms/Label.vue';
  import FormInputText from '../../components/forms/InputText.vue';
  import FormTextArea from '../../components/forms/TextArea.vue';
  import FormFieldError from '../../components/forms/FieldError.vue';
  
  const props = defineProps(['id']);
  const emit = defineEmits(['createdPermission', 'updatedPermission', 'cancel']);
  
  const form_data = ref({
    id: null,
    name: '',
    description: '',
  });
  
  const form_errors = ref({});
  
  await onMounted(async () => {
    if (props.id) {
      await axios.get(`${import.meta.env.VITE_API_URL}/permissions/${props.id}`)
        .then(response => {
          Object.keys(form_data.value).forEach(key => {
            if (response.data.hasOwnProperty(key)) {
              form_data.value[key] = response.data[key];
            }
          });
        });
    }
  });
  
  const savePermission = () => {
    if (form_data.value.id) {
      axios.put(`${import.meta.env.VITE_API_URL}/permissions/${form_data.value.id}`, form_data.value)
        .then(response => emit('updatedPermission', response.data))
        .catch(error => {
          if (error.response.status === 400) {
            form_errors.value = error.response.data;
          }
        });
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/permissions`, form_data.value)
        .then(response => emit('createdPermission', response.data))
        .catch(error => {
          if (error.response.status === 400) {
            form_errors.value = error.response.data;
          }
        });
    }
  };
</script>

<template>
  <div class="absolute inset-0 w-full h-full flex justify-center items-center bg-gray-200 bg-opacity-50 p-12 z-50">
    <card class="w-192 max-h-full overflow-y-auto">
      <card-header
        :icon="props.id ? 'fas fa-pencil' : 'fas fa-plus'"
        :label="props.id ? 'Update Permission' : 'Create Permission'"
        :actions="['save', 'cancel']"
        @save="savePermission"
        @cancel="$emit('cancel')"
      />
      
      <form @submit.prevent class="flex flex-grow">
        <div class="w-full flex flex-col space-y-6">
          <div class="flex flex-col space-y-1">
            <form-label :text="'Name'" />
            <form-input-text v-model:value="form_data.name" />
            <form-field-error v-if="form_errors.name" :text="form_errors.name[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Description'" />
            <form-text-area v-model:value="form_data.description" />
            <form-field-error v-if="form_errors.description" :text="form_errors.description[0]" />
          </div>
        </div>
      </form>
    </card>
  </div>
</template>