<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-material.min.css';
  import { AgGridVue } from 'ag-grid-vue3';
  import Card from '../../../components/cards/Base.vue';
  import CardHeader from '../../../components/cards/Header.vue';
  
  const props = defineProps(['user_id', 'permission_id']);
  const emit = defineEmits(['updatedPermission', 'close']);
  
  const form_data = ref({
    name: '',
    description: '',
    offices: [],
  });
  
  const ag_grid_options = ref({
    api: null,
    row_data: [],
    column_defs: [
      {
        headerName: 'Offices',
        flex: 1,
        sortable: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        valueGetter: params => `${params.data.name} (${params.data.short_name})`,
      },
    ],
  });
  
  const onGridReady = params => ag_grid_options.value.api = params.api;
  
  await onMounted(async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}/offices`)
      .then(response => ag_grid_options.value.row_data = response.data);
      
    await axios.get(`${import.meta.env.VITE_API_URL}/user/${props.user_id}/permissions/${props.permission_id}`)
      .then(response => {
        form_data.value.name = response.data.name;
        form_data.value.description = response.data.description;
        form_data.value.offices = response.data.offices;
        
        ag_grid_options.value.api.forEachNode(node => {
          node.setSelected(form_data.value.offices.find(x => x.id === node.data.id) !== undefined);
        });
      });
  });
  
  const updatePermission = () => {
    axios.put(`${import.meta.env.VITE_API_URL}/user/${props.user_id}/permissions/${props.permission_id}`, {
      offices: ag_grid_options.value.api.getSelectedRows().map(x => x.id),
    }).then(response => emit('updatedPermission', response.data));
  };
</script>

<template>
  <card class="w-192 h-full overflow-y-auto">
    <card-header
      :icon="'fas fa-shield-halved'"
      :label="'Manage Permission'"
      :actions="['save', 'cancel']"
      @save="updatePermission"
      @cancel="$emit('close')"
    />
    
    <div class="flex flex-col space-y-1 bg-gray-50 p-4 rounded">
      <span class="text-gray-600 font-medium">{{ form_data.name }}</span>
      <span class="text-gray-500 text-sm">{{ form_data.description }}</span>
    </div>
    
    <ag-grid-vue
      class="w-full h-full ag-theme-material"
      @grid-ready="onGridReady"
      :class="{ 'h-192': ag_grid_options.row_data.length >= 10 }"
      :columnDefs="ag_grid_options.column_defs"
      :rowData="ag_grid_options.row_data"
      :rowSelection="'multiple'"
      :suppressRowClickSelection="true"
      :domLayout="ag_grid_options.row_data.length < 10 ? 'autoHeight' : 'normal'"
    />
  </card>
</template>