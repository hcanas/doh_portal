<script setup>
  import { ref, watch } from 'vue';
  import axios from 'axios';
  
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-material.min.css';
  import { AgGridVue } from 'ag-grid-vue3';
  import AgGridTitleCol from './AgGridTitleCol.vue';
  import AgGridActionsCol from './AgGridActionsCol.vue';
  
  import Modal from '../../components/overlays/Modal.vue';
  import Card from '../../components/cards/Base.vue';
  import CardHeader from '../../components/cards/Header.vue';
  import CustomForm from './Form.vue';
  
  const ag_grid_options = ref({
    api: null,
    row_data: [],
    column_defs: [
      {
        headerName: '',
        autoHeight: true,
        flex: 1,
        cellRenderer: AgGridTitleCol,
        getQuickFilterText: params => params.data.title + ' ' + params.data.description,
      },
      {
        headerName: '',
        width: 100,
        cellRenderer: AgGridActionsCol,
        cellRendererParams: {
          clicked: params => {
            switch (params.action) {
              case 'edit':
                showUpdateForm(params.id);
                break;
      
              case 'delete':
                removeAnnouncement(params.id);
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
  
  await axios.get(`${import.meta.env.VITE_API_URL}/announcements`)
    .then(response => ag_grid_options.value.row_data = response.data);
  
  const onGridReady = params => ag_grid_options.value.api = params.api;

  const showCreateForm = () => {
    form_options.value.id = null;
    form_options.value.show = true;
  };

  const showUpdateForm = id => {
    form_options.value.id = id;
    form_options.value.show = true;
  };

  const createdAnnouncement = new_announcement => {
    ag_grid_options.value.api.applyTransaction({
      add: [new_announcement],
      addIndex: 0,
    });
  
    form_options.value.show = false;
  };

  const updatedAnnouncement = new_announcement => {
    ag_grid_options.value.api.applyTransaction({ update: [new_announcement] });
  
    form_options.value.show = false;
  };

  const removeAnnouncement = id => {
    axios.delete(`${import.meta.env.VITE_API_URL}/announcements/${id}`)
      .then(() => {
        const removed_announcement = ag_grid_options.value.row_data.find(x => x.id === id);
        ag_grid_options.value.api.applyTransaction({ remove: [removed_announcement] });
      });
  };
  
  watch(() => ag_grid_options.value.filter_text, text => ag_grid_options.value.api.setQuickFilter(text));
</script>

<template>
  <div class="w-full h-full flex items-stretch space-x-12">
    <card class="flex-shrink-0 w-96 p-12">
      <div class="flex flex-col space-y-12">
        <div class="flex justify-center items-center space-x-2">
          <img src="/images/DOH-Logo.png" class="flex-shrink-0 w-20">
          <div class="flex-shrink-0">
            <p class="text-xs border-b leading-4">Republic of the Philippines</p>
            <p class="text-xs xl:text-base uppercase font-bold leading-4">Department of Health</p>
            <p class="text-xs xl:text-sm uppercase font-medium leading-4">Center for Health Development</p>
            <p class="text-xs uppercase italic leading-4">Cordillera Administrative Region</p>
          </div>
        </div>
      
        <div class="flex flex-col space-y-6 xl:space-y-12">
          <div class="flex flex-col">
            <h3 class="text-sm uppercase font-bold border-b">Vision</h3>
            <p class="text-sm">Filipinos are among the healthiest people in Southeast Asia by 2022 and Asia by 2040.</p>
          </div>
        
          <div class="flex flex-col">
            <h3 class="text-sm uppercase font-bold border-b">Mission</h3>
            <p class="text-sm">To lead the country in the development of a productive, resilient, equitable, and people-centered health system.</p>
          </div>
        
          <div class="flex flex-col">
            <h3 class="text-sm uppercase font-bold border-b">The DOH Quality Policy</h3>
            <p class="text-sm">The Department of Health, as the nation’s leader in health, is committed to nurturing Filipinos to be
              amongst the healthiest in Southeast Asia by 2022 and Asia by 2040 through the development of a productive, resilient, equitable,
              and people-centered health system.
            
              We at the DOH, together with our partners, are committed to implementing standards and policies to ensure the highest
              quality of health services to the satisfaction of our clients.  We observe zero-tolerance against corruption, comply
              with statutory requirements, and continually improve our quality management systems as we provide public service with
              integrity, excellence, and compassion.</p>
          </div>
        </div>
      
        <div class="flex justify-center xl:hidden">
          <button @click="showLogin" class="w-full bg-white rounded px-4 py-2 hover:bg-gray-100">
            <div class="flex justify-center items-center space-x-2">
              <i class="fas fa-arrow-right text-sm text-gray-600" />
              <span class="text-sm text-gray-600 font-medium uppercase">Sign In</span>
            </div>
          </button>
        </div>
      </div>
    </card>
    
    <card class="flex-grow">
      <card-header
        :icon="'fas fa-bullhorn'"
        :label="'Announcements'"
        :actions="['create', 'search']"
        v-model:searchValue="ag_grid_options.filter_text"
        @create="showCreateForm"
      >
        <template #icon_create>
          <i class="fas fa-scroll" />
        </template>
        <template #text_create>
          <span>New Announcement</span>
        </template>
      </card-header>
  
      <ag-grid-vue
        class="w-full h-full ag-theme-material"
        @grid-ready="onGridReady"
        :headerHeight="0"
        :rowData="ag_grid_options.row_data"
        :getRowId="params => params.data.id"
        :columnDefs="ag_grid_options.column_defs"
        :pagination="true"
        :paginationPageSize="20"
      />
    </card>
    
    <card class="w-96">
      <card-header :icon="'fas fa-computer'" :label="'Information Systems'" />
      <div class="">
      
      </div>
    </card>
  </div>
  
  <modal :show="form_options.show">
    <custom-form
      v-if="form_options.show"
      :id="form_options.id"
      @createdAnnouncement="createdAnnouncement"
      @updatedAnnouncement="updatedAnnouncement"
      @cancel="form_options.show = false"
    />
  </modal>
</template>