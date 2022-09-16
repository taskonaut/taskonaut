import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import { createPinia } from 'pinia';

//App Components
import AppSidebar from './components/AppSidebar.vue';
import ProjectView from './views/ProjectView.vue';

const pinia = createPinia();
const app = createApp(App);

app.component('AppSidebar', AppSidebar).component('ProjectView', ProjectView);

loadFonts();

app.use(pinia).use(router).use(vuetify);
app.mount('#app');
