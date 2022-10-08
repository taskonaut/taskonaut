// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: '#D74F4F',
        background: '#1A1A1A',
    },
};

const customLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: '#D74F4F',
    },
};

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'customDarkTheme',
        themes: {
            customDarkTheme,
            customLightTheme,
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
