<template>
    <v-btn v-if="loggedIn" @click="userStore.logout" append-icon="mdi-logout"
        >LOGOUT</v-btn
    >
    <v-btn v-else @click="userStore.login" append-icon="mdi-login"
        >LOGIN WITH GOOGLE</v-btn
    >
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
const loggedIn = useUserStore().isLoggedIn;
</script>

<style scoped></style>
