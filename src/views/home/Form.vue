<script setup>
  import { ref, watch, onMounted } from 'vue';
  import axios from 'axios';
  
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import FormLabel from '../../components/forms/Label.vue';
  import FormInputText from '../../components/forms/InputText.vue';
  import FormTextArea from '../../components/forms/TextArea.vue';
  import FormFieldError from '../../components/forms/FieldError.vue';
  
  const props = defineProps(['id']);
  const emit = defineEmits(['createdAnnouncement', 'updatedAnnouncement', 'cancel']);
  
  const form_data = ref({
    id: null,
    title: '',
    description: '',
  });
  
  const form_errors = ref({});
  
  await onMounted(async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}/announcements/${props.id}`)
      .then(response => {
        Object.keys(form_data.value).forEach(key => {
          if (response.data.hasOwnProperty(key)) {
            form_data.value[key] = response.data[key];
          }
        });
      });
  });
  
  const saveAnnouncement = () => {
    if (form_data.value.id) {
      axios.put(`${import.meta.env.VITE_API_URL}/announcements/${form_data.value.id}`, form_data.value)
        .then(response => emit('updatedAnnouncement', response.data))
        .catch(error => {
          if (error.response.status === 400) {
            form_errors.value = error.response.data;
          }
        });
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/announcements`, form_data.value)
        .then(response => emit('createdAnnouncement', response.data))
        .catch(error => {
          if (error.response.status === 400) {
            form_errors.value = error.response.data;
          }
        });
    }
  };
</script>

<template>
  <card class="w-192 max-h-full overflow-y-auto">
    <card-header
      :icon="props.id ? 'fas fa-pencil' : 'fas fa-scroll'"
      :label="props.id ? 'Update Announcement' : 'Create Announcement'"
      :actions="['save', 'cancel']"
      @save="saveAnnouncement"
      @cancel="$emit('cancel')"
    />
    
    <form @submit.prevent class="flex flex-grow">
      <div class="w-full flex flex-col space-y-6">
        <div class="flex flex-col space-y-1">
          <form-label :text="'Name'" />
          <form-input-text v-model:value="form_data.title" />
          <form-field-error v-if="form_errors.title" :text="form_errors.title[0]" />
        </div>
        <div class="flex flex-col space-y-1">
          <form-label :text="'Description'" />
          <form-text-area v-model:value="form_data.description" />
          <form-field-error v-if="form_errors.description" :text="form_errors.description[0]" />
        </div>
      </div>
    </form>
  </card>
</template>