<template>
    <v-list select-strategy="leaf" bg-color="background">
        <v-list-subheader>AUTH</v-list-subheader>
        <v-list-item
            :title="
                loggedIn
                    ? `You are logged in as ${userStore.displayName}`
                    : 'You are not logged in'
            "
        >
            <v-list-item-subtitle>
                {{
                    loggedIn
                        ? `Google FireStore is used as storage`
                        : `You data
                are stored in local storage of your browser.
                Login to to sync the data between multiple devices.`
                }}</v-list-item-subtitle
            >
            <template v-slot:append>
                <v-list-item-action
                    ><v-btn
                        v-if="loggedIn"
                        @click="userStore.logout"
                        append-icon="mdi-logout"
                        >LOGOUT</v-btn
                    >
                    <v-btn
                        v-else
                        @click="userStore.login"
                        append-icon="mdi-login"
                        >LOGIN WITH GOOGLE</v-btn
                    ></v-list-item-action
                >
            </template>
        </v-list-item>
        <v-list-subheader>STORAGE</v-list-subheader>
        <v-list-item title="Export data">
            <v-list-item-subtitle>
                Backup your data as file
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-list-item-action
                    ><v-btn
                        @click="exportData"
                        variant="text"
                        append-icon="mdi-file-export"
                        >EXPORT</v-btn
                    >
                </v-list-item-action>
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item title="Import data">
            <v-list-item-subtitle>
                Import your data into application from exported backup file
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-list-item-action
                    ><v-btn
                        @click="importData"
                        variant="text"
                        append-icon="mdi-file-import"
                        >IMPORT</v-btn
                    >
                </v-list-item-action>
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item title="Reset application">
            <v-list-item-subtitle>
                Removes all the data from the current storage
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-list-item-action
                    ><v-btn
                        @click="resetData"
                        variant="text"
                        color="error"
                        append-icon="mdi-delete-forever"
                        >RESET</v-btn
                    >
                </v-list-item-action>
            </template>
        </v-list-item>
        <v-list-subheader>APPEARANCE</v-list-subheader>
        <v-list-item title="Theme">
            <v-list-item-subtitle>
                Select visual theme of the application
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-list-item-action>
                    <v-btn-toggle
                        tile
                        color="deep-purple accent-3"
                        group
                        v-model="theme.global.name.value"
                        variant="outlined"
                    >
                        <v-btn value="customLightTheme"> Light </v-btn>
                        <v-btn value="customDarkTheme"> Dark </v-btn>
                    </v-btn-toggle>
                </v-list-item-action>
            </template>
        </v-list-item>
        <v-list-subheader>ABOUT</v-list-subheader>
        <v-list-item title="Version">
            <v-list-item-subtitle>
                Current version of the application
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-list-item-action> v0.0.1 </v-list-item-action>
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item title="Support us">
            <v-list-item-subtitle>
                Add a star and support the project on GitHub
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-btn
                    href="https://github.com/taskominator/taskominator"
                    target="_blank"
                    variant="text"
                    append-icon="mdi-github"
                    >GitHub</v-btn
                >
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item title="Report a bug">
            <v-list-item-subtitle>
                Create an issue if you found a bug, thank you!
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-btn
                    href="https://github.com/taskominator/taskominator/issues"
                    target="_blank"
                    variant="text"
                    append-icon="mdi-bug"
                    >Issues</v-btn
                >
            </template>
        </v-list-item>
    </v-list>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useTheme } from 'vuetify/lib/framework.mjs';

const userStore = useUserStore();
const loggedIn = userStore.isLoggedIn;
const theme = useTheme();

function exportData() {
    // TODO: implement me
}

function importData() {
    // TODO: implement me
}

function resetData() {
    // TODO: implement me
}

function saveTheme() {
    // TODO: implement me
}
</script>
<style scoped>
.v-list-item {
    padding-bottom: 10px !important;
}
</style>
