import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import './firebaseConfig';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.component('Datepicker', Datepicker);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.mount('#app');
