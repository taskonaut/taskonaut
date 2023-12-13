import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import '@vuepic/vue-datepicker/dist/main.css';

const pinia = createPinia();
const app = createApp(App);

loadFonts();
app.use(pinia).use(router).use(vuetify);
app.mount('#app');
