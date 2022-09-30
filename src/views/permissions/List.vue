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
        sortable: true,
      },
      {
        headerName: 'Description',
        field: 'description',
        flex: 1,
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
                showUpdateForm(params.id);
                break;
                
              case 'delete':
                removePermission(params.id);
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
  
  await axios.get(`${import.meta.env.VITE_API_URL}/permissions`)
    .then(response => ag_grid_options.value.row_data = response.data)
    .catch(() => {});

  const showCreateForm = () => {
    form_options.value.id = null;
    form_options.value.show = true;
  };

  const showUpdateForm = id => {
    form_options.value.id = id;
    form_options.value.show = true;
  };
  
  const createdPermission = new_permission => {
    ag_grid_options.value.api.applyTransaction({
      add: [new_permission],
      addIndex: 0,
    });
    
    form_options.value.show = false;
  };
  
  const updatedPermission = new_permission => {
    ag_grid_options.value.api.applyTransaction({ update: [new_permission] });
    
    form_options.value.show = false;
  };
  
  const removePermission = id => {
    axios.delete(`${import.meta.env.VITE_API_URL}/permissions/${id}`)
      .then(() => {
        const removed_permission = ag_grid_options.value.row_data.find(x => x.id === id);
        ag_grid_options.value.api.applyTransaction({ remove: [removed_permission] });
      });
  };

  const onGridReady = params => ag_grid_options.value.api = params.api;
  
  watch(() => ag_grid_options.value.filter_text, text => ag_grid_options.value.api.setQuickFilter(text));
</script>

<template>
  <card class="w-full h-full">
    <card-header
      :icon="'fas fa-shield-halved'"
      :label="'Permissions'"
      :actions="['create', 'search']"
      v-model:searchValue="ag_grid_options.filter_text"
      @create="showCreateForm"
    >
      <template #text_create>
        <span>New Permission</span>
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
      @createdPermission="createdPermission"
      @updatedPermission="updatedPermission"
      @cancel="form_options.show = false"
    />
  </modal>
</template>