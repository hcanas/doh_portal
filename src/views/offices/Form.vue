<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import FormLabel from '../../components/forms/Label.vue';
  import FormInputText from '../../components/forms/InputText.vue';
  import FormSelect from '../../components/forms/Select.vue';
  import FormFieldError from '../../components/forms/FieldError.vue';
  
  const props = defineProps(['id']);
  const emit = defineEmits(['createdOffice', 'updatedOffice', 'cancel']);
  
  const form_data = ref({
    id: null,
    name: '',
    short_name: '',
    unit: 'cluster',
    parent_id: null,
  });
  
  const form_options = ref({
    offices: [],
    units: [
      { value: 'cluster', label: 'Cluster' },
      { value: 'section', label: 'Section' },
      { value: 'division', label: 'Division' },
    ],
  });
  
  const form_errors = ref({});
  
  await onMounted(async () => {
    if (props.id) {
      await axios.get(`${import.meta.env.VITE_API_URL}/offices/${props.id}`)
        .then(response => {
          Object.keys(form_data.value).forEach(key => {
            if (response.data.hasOwnProperty(key)) {
              form_data.value[key] = response.data[key];
            }
          });
        });
    }
    
    await axios.get(`${import.meta.env.VITE_API_URL}/offices`)
      .then(response => {
        form_options.value.offices = response.data.map(({ id, name, short_name }) => {
          return {
            label: name + ' (' + short_name + ')',
            value: id,
          }
        });
        
        form_data.value.parent_id = form_data.value.parent_id ?? form_options.value.offices[0].value;
      });
  });
  
  const saveOffice = () => {
    if (form_data.value.id) {
      axios.put(`${import.meta.env.VITE_API_URL}/offices/${form_data.value.id}`, form_data.value)
        .then(response => emit('updatedOffice', response.data))
        .catch(error => {
          if (error.response.status === 400) {
            form_errors.value = error.response.data;
          }
        });
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/offices`, form_data.value)
        .then(response => emit('createdOffice', response.data))
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
        :label="props.id ? 'Update Office' : 'Create Office'"
        :actions="['save', 'cancel']"
        @save="saveOffice"
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
            <form-label :text="'Short Name'" />
            <form-input-text v-model:value="form_data.short_name" />
            <form-field-error v-if="form_errors.short_name" :text="form_errors.short_name[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Unit'" />
            <form-select v-model:value="form_data.unit" :options="form_options.units" />
            <form-field-error v-if="form_errors.unit" :text="form_errors.unit[0]" />
          </div>
          <div class="flex flex-col space-y-1">
            <form-label :text="'Parent Office'" />
            <form-select v-model:value="form_data.parent_id" :options="form_options.offices" />
            <form-field-error v-if="form_errors.parent_id" :text="form_errors.parent_id[0]" />
          </div>
        </div>
      </form>
    </card>
  </div>
</template>