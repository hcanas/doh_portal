<script setup>
  import { ref, watch } from 'vue';
  import axios from 'axios';
  
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-material.min.css';
  import { AgGridVue } from 'ag-grid-vue3';
  import AgGridNameCol from './AgGridNameCol.vue';
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import CustomForm from './Form.vue';
  import Modal from '../../components/overlays/Modal.vue';

  const show_form = ref(false);
  const storage_url = import.meta.env.VITE_API_STORAGE_URL + '/photos';
  
  const ag_grid_options = ref({
    api: null,
    row_data: [],
    column_defs: [
      {
        headerName: '',
        field: 'name',
        flex: 1,
        sortable: true,
        cellRenderer: AgGridNameCol,
        getQuickFilterText: params => {
          const temp_data = [];
          
          Object.keys(params.data).forEach(key => {
            if (typeof params.data[key] === 'string' || typeof params.data[key] === "number") {
              temp_data.push(params.data[key]);
            }
          });
          
          return temp_data.join(' ');
        },
      },
    ],
    filter_text: '',
  });
  
  await axios.get(`${import.meta.env.VITE_API_URL}/users`)
  .then(response => ag_grid_options.value.row_data = response.data)
  .catch(() => {});
  
  const onAgGridReady = params => ag_grid_options.value.api = params.api;
  
  const createdUser = new_user => {
    ag_grid_options.value.api.applyTransaction({
      add: [new_user],
      addIndex: 0,
    });
    
    show_form.value = false;
  };
  
  watch(() => ag_grid_options.value.filter_text, text => ag_grid_options.value.api.setQuickFilter(text));
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <card :class="'flex-grow'">
      <card-header
        :icon="'fas fa-users'"
        :label="'Users'"
        :actions="['create', 'search']"
        v-model:searchValue="ag_grid_options.filter_text"
        @create="show_form = true"
      >
        <template #icon_create>
          <i class="fas fa-user-plus" />
        </template>
        <template #text_create>
          <span>New User</span>
        </template>
      </card-header>
      
      <ag-grid-vue
        class="w-full h-full ag-theme-material"
        @grid-ready="onAgGridReady"
        :headerHeight="0"
        :rowData="ag_grid_options.row_data"
        :columnDefs="ag_grid_options.column_defs"
        :rowHeight="'220'"
        :pagination="true"
        :paginationPageSize="20"
      />
    </card>
  </div>
  
  <modal :show="show_form">
    <custom-form
      @createdUser="createdUser"
      @cancel="show_form = false"
    />
  </modal>
</template>