import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import axios from 'axios';
import './style.css';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createApp(App)
  .use(router)
  .mount('#app')
