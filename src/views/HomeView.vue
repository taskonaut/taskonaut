<template>
    <v-layout>
        <v-app-bar color="primary" app>
            <v-app-bar-nav-icon
                variant="text"
                @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <v-toolbar-title>Taskominator</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn variant="text" icon="mdi-magnify"></v-btn>
            <v-btn variant="text" icon="mdi-filter"></v-btn>
            <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
        </v-app-bar>

        <Sidebar :drawer="drawer" />

        <v-main style="height: 100vh">
            <Main />
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Main from '../components/Main.vue';
import Sidebar from '../components/Sidebar.vue';

const drawer = ref(false);

const items = [
    {
        title: 'Foo',
        value: 'foo',
    },
    {
        title: 'Bar',
        value: 'bar',
    },
    {
        title: 'Fizz',
        value: 'fizz',
    },
    {
        title: 'Buzz',
        value: 'buzz',
    },
];
</script>
