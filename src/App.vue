<template>
    <v-app>
        <AppSidebar v-model="drawer" />
        <v-app-bar color="primary" :floating="true">
            <v-app-bar-nav-icon
                variant="text"
                @click="toggleDrawer()"
            ></v-app-bar-nav-icon>
            <v-toolbar-title>Taskominator</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn variant="text" icon="mdi-magnify"></v-btn>
            <v-btn variant="text" icon="mdi-filter"></v-btn>
            <v-btn
                @click="toggleTheme"
                variant="text"
                icon="mdi-theme-light-dark"
            ></v-btn>
            <v-btn
                v-if="loggedIn"
                variant="text"
                icon="mdi-logout"
                @click="userStore.logout"
            ></v-btn>
            <v-btn
                v-else
                variant="text"
                icon="mdi-login"
                @click="userStore.login"
            ></v-btn>
        </v-app-bar>
        <v-main :scrollable="true"
            ><v-container
                ><router-view :key="useRoute().fullPath"
            /></v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from './stores/userStore';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import AppSidebar from './components/AppSidebar.vue';

const drawer = ref(true);

const userStore = useUserStore();
const loggedIn = computed(() => !!userStore.uid);
const theme = useTheme();

function toggleDrawer() {
    drawer.value = !drawer.value;
}

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark';
}
</script>

<style scoped></style>
