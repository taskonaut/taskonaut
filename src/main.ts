import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';

import AppSidebar from './components/AppSidebar.vue';
loadFonts();

createApp(App).use(router).use(vuetify).mount('#app');
