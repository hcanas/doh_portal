<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { Calendar } from 'v-calendar';
  import 'v-calendar/dist/style.css';
  
  const props = defineProps(['id']);
  
  const calendar_options = ref({
    masks: {
      weekdays: 'WWW',
    },
    data: [],
  });
  
  const date = ref(new Date());
  const year = ref(date.value.getFullYear());
  const month = ref(date.value.getMonth() + 1);
  
  const loadLogs = (id, month, year) => {
    axios.get(`${import.meta.env.VITE_API_URL}/time_log?id=${id}&month=${month}&year=${year}`)
      .then(response => {
        calendar_options.value.data = [];
        
        response.data.forEach(x => {
          calendar_options.value.data.push({
            customData: {
              title: x.checktime.substr(11, 5),
              class: x.checktype === 'I' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
            },
            dates: new Date(x.checktime.substring(0, 10)),
          });
        });
      })
      .catch(error => {});
  };
  
  const pageChange = page => {
    loadLogs(props.id, page.month, page.year);
  };
  
  onMounted(() => {
    loadLogs(props.id, month.value, year.value);
  });
</script>

<template>
  <calendar
    class="custom-calendar"
    :masks="calendar_options.masks"
    :attributes="calendar_options.data"
    @update:from-page="pageChange"
  >
    <template v-slot:day-content="{ day, attributes }">
      <div class="flex flex-col h-full z-10 overflow-hidden">
        <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
        <div class="flex-grow overflow-y-auto overflow-x-auto">
          <p
            v-for="attr in attributes"
            :key="attr.key"
            class="text-xs leading-tight p-1"
            :class="attr.customData.class"
          >
            {{ attr.customData.title }}
          </p>
        </div>
      </div>
    </template>
  </calendar>
</template>

<style>
  .vc-container {
    @apply w-full rounded
  }
  
  .vc-weeks {
    @apply p-4
  }
  
  .vc-weekday {
    @apply text-white bg-gray-800 p-2
  }
  
  .vc-day {
    @apply p-2 border
  }
  
  .day-label {
    @apply text-gray-400
  }
  
  .is-not-in-month {
    @apply bg-gray-100
  }
</style>