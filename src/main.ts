import { createPinia } from 'pinia';
import { PiniaFirestoreSync } from 'pinia-plugin-firestore-sync';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import '@/assets/main.css';

// App Components
import AppSidebar from './components/AppSidebar.vue';
import { firebaseConfig } from './firebaseConfig';

// Firebase
import { initializeApp } from 'firebase/app';
import DisplayTasks from './components/shared/DisplayTasks.vue';

initializeApp(firebaseConfig);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(PiniaFirestoreSync);
const app = createApp(App);

app.component('AppSidebar', AppSidebar).component('DisplayTasks', DisplayTasks);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.mount('#app');
