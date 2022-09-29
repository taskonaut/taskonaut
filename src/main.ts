import '@/assets/main.css';
import { createPinia } from 'pinia';
import { PiniaFirestoreSync } from 'pinia-plugin-firestore-sync';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';

// Firebase
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

initializeApp(firebaseConfig);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(PiniaFirestoreSync);
const app = createApp(App);
app.component('Datepicker', Datepicker);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.mount('#app');
