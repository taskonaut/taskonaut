import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import './includes/firebase';

const pinia = createPinia();
const app = createApp(App);
app.component('Datepicker', Datepicker);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.mount('#app');
