<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import axios from 'axios';
  
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-material.min.css';
  import { AgGridVue } from 'ag-grid-vue3';
  import AgGridNameCol from './AgGridNameCol.vue';
  import AgGridOfficeCol from './AgGridOfficeCol.vue';
  import CustomForm from './Form.vue';
  import Modal from '../../../components/overlays/Modal.vue';
  
  const props = defineProps(['id', 'filter_text']);
  
  const form = ref({
    show: false,
    id: null,
  });
  
  const ag_grid_options = ref({
    api: null,
    row_data: [],
    column_defs: [
      {
        headerName: 'Name',
        field: 'name',
        sortable: true,
        flex: 1,
        wrapText: true,
        autoHeight: true,
        cellRenderer: AgGridNameCol,
        getQuickFilterText: params => params.value,
      },
      {
        headerName: 'Offices',
        field: 'offices',
        sortable: true,
        flex: 1,
        wrapText: true,
        autoHeight: true,
        cellRenderer: AgGridOfficeCol,
        cellRendererParams: {
          clicked: id => {
            form.value.id = id;
            form.value.show = true;
          },
        },
        getQuickFilterText: params => params.value?.map(({ short_name }) => short_name).join(' '),
      },
    ],
    filter_text: computed(() => props.filter_text),
  });
  
  const onGridReady = params => ag_grid_options.value.api = params.api;
  
  onMounted(async () => {
    const permissions = ref(null);
    
    await axios.get(`${import.meta.env.VITE_API_URL}/permissions`)
      .then(response => permissions.value = response.data);
    
    axios.get(`${import.meta.env.VITE_API_URL}/user/${props.id}/permissions`)
      .then(response => {
        permissions.value.forEach((x, i) => {
          response.data.some(permission => {
            if (permission.id === x.id) {
              permissions.value[i].offices = permission.offices;
            }
          });
        });
        
        ag_grid_options.value.row_data = permissions;
      });
  });
  
  const updatedPermission = updated_permission => {
    ag_grid_options.value.api.applyTransaction({
      update: [updated_permission],
    });
    
    form.value.show = false;
    form.value.id = null;
  };
  
  watch(() => ag_grid_options.value.filter_text, text => ag_grid_options.value.api.setQuickFilter(text));
</script>

<template>
  <ag-grid-vue
    class="w-full h-full ag-theme-material"
    @grid-ready="onGridReady"
    :class="{ 'h-192': ag_grid_options.row_data.length >= 10 }"
    :rowData="ag_grid_options.row_data"
    :columnDefs="ag_grid_options.column_defs"
    :getRowId="params => params.data.id"
    :pagination="true"
    :paginationPageSize="10"
    :domLayout="ag_grid_options.row_data.length < 10 ? 'autoHeight' : 'normal'"
  />
  
  <modal :show="form.show">
    <custom-form
      :user_id="props.id"
      :permission_id="form.id"
      @updatedPermission="updatedPermission"
      @close="form.show = false"
    />
  </modal>
</template>