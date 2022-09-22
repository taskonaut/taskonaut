import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';

// App Components
import AppSidebar from './components/AppSidebar.vue';
import { firebaseConfig } from './firebaseConfig';

// Firebase
import { initializeApp } from 'firebase/app';
import DisplayTasks from './components/shared/DisplayTasks.vue';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.component('AppSidebar', AppSidebar).component('DisplayTasks', DisplayTasks);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.mount('#app');

initializeApp(firebaseConfig);
