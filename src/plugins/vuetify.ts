// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: '#ff5c5c',
    },
};

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'customDarkTheme',
        themes: {
            customDarkTheme,
        },
    },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
