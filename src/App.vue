<template>
    <v-app>
        <v-main>
            <v-layout>
                <v-app-bar color="primary" app>
                    <v-app-bar-nav-icon
                        variant="text"
                        @click="toggleDrawer()"
                    ></v-app-bar-nav-icon>
                    <v-toolbar-title>Taskominator</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn variant="text" icon="mdi-magnify"></v-btn>
                    <v-btn variant="text" icon="mdi-filter"></v-btn>
                    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
                </v-app-bar>
                <AppSidebar v-model:drawer="drawer" />
                <v-main style="height: 100vh">
                    <router-view :key="useRoute().fullPath"
                /></v-main>
            </v-layout>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const drawer = ref(true);

function toggleDrawer() {
    drawer.value = !drawer.value;
}
</script>

<style scoped></style>
