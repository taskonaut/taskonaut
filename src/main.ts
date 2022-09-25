import { createPinia } from 'pinia';
import { PiniaFirestoreSync } from 'pinia-plugin-firestore-sync';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import '@/assets/main.css';

// Firebase
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';

initializeApp(firebaseConfig);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(PiniaFirestoreSync);
const app = createApp(App);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.mount('#app');
