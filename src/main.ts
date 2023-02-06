import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import { VueFire, VueFireAuth } from 'vuefire';
import { app as firebaseApp } from './includes/firebase';

const pinia = createPinia();
const app = createApp(App);
// eslint-disable-next-line vue/multi-word-component-names
app.component('Datepicker', Datepicker);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
});
app.mount('#app');
