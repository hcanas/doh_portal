<script setup>
  import { ref, watch } from 'vue';
  import axios from 'axios';
  
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-material.min.css';
  import { AgGridVue } from 'ag-grid-vue3';
  import AgGridActionsCol from './AgGridActionsCol.vue';
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import Modal from '../../components/overlays/Modal.vue';
  import CustomForm from './Form.vue';
  
  const ag_grid_options = ref({
    api: null,
    row_data: [],
    column_defs: [
      {
        headerName: 'Name',
        field: 'name',
        flex: 2,
        sortable: true,
      },
      {
        headerName: 'Short Name',
        field: 'short_name',
        flex: 1,
        sortable: true,
      },
      {
        headerName: 'Unit',
        field: 'unit',
        flex: 1,
        sortable: true,
        valueGetter: params => params.data.unit ? (params.data.unit.charAt(0).toUpperCase() + params.data.unit.slice(1)) : '',
      },
      {
        headerName: 'Parent Office',
        field: 'parent.name',
        flex: 2,
        sortable: true,
      },
      {
        headerName: 'Actions',
        width: 100,
        cellRenderer: AgGridActionsCol,
        cellRendererParams: {
          clicked: params => {
            switch (params.action) {
              case 'edit':
                form_options.value.id = params.id;
                form_options.value.show = true;
                break;
                
              case 'delete':
                removeOffice(params.id);
                break;
            }
          },
        },
      },
    ],
    filter_text: '',
  });
  
  const form_options = ref({
    show: false,
    id: null,
  });
  
  await axios.get(`${import.meta.env.VITE_API_URL}/offices`)
    .then(response => ag_grid_options.value.row_data = response.data)
    .catch(() => {});
  
  const onGridReady = params => ag_grid_options.value.api = params.api;
  
  const showCreateForm = () => {
    form_options.value.id = null;
    form_options.value.show = true;
  };
  
  const createdOffice = new_office => {
    ag_grid_options.value.api.applyTransaction({
      add: [new_office],
      addIndex: 0,
    });
    
    form_options.value.show = false;
  };
  
  const updatedOffice = updated_office => {
    ag_grid_options.value.api.applyTransaction({ update: [updated_office] });
    
    form_options.value.show = false;
  };
  
  const removeOffice = id => {
    axios.delete(`${import.meta.env.VITE_API_URL}/offices/${id}`)
      .then(() => {
        const removed_office = ag_grid_options.value.row_data.find(x => x.id === id);
        ag_grid_options.value.api.applyTransaction({ remove: [removed_office] });
      });
  };
  
  watch(() => ag_grid_options.value.filter_text, text => ag_grid_options.value.api.setQuickFilter(text));
</script>

<template>
  <card class="w-full h-full">
    <card-header
      :icon="'fas fa-building'"
      :label="'Offices'"
      :actions="['create', 'search']"
      v-model:searchValue="ag_grid_options.filter_text"
      @create="showCreateForm"
    >
      <template #text_create>
        <span>New Office</span>
      </template>
    </card-header>
    
    <ag-grid-vue
      class="w-full h-full ag-theme-material"
      @grid-ready="onGridReady"
      :rowData="ag_grid_options.row_data"
      :getRowId="params => params.data.id"
      :columnDefs="ag_grid_options.column_defs"
      :pagination="true"
      :paginationPageSize="20"
    />
  </card>
  
  <modal :show="form_options.show">
    <custom-form
      :id="form_options.id"
      @created-office="createdOffice"
      @updated-office="updatedOffice"
      @cancel="form_options.show = false"
    />
  </modal>
</template>