<template>
    <v-app v-if="userStore.isLoggedIn && appStore.ready">
        <v-app-bar
            :color="theme.global.current.value.dark ? 'accent' : 'primary'"
            :floating="true"
            density="compact"
        >
            <v-app-bar-nav-icon
                variant="text"
                @click="toggleDrawer()"
            ></v-app-bar-nav-icon>
            <v-toolbar-title>
                <span id="routeName">{{ getRouteName() }}</span>
            </v-toolbar-title>
            <v-btn
                v-if="$router.currentRoute.value.name !== 'settings'"
                @click="showDialog = true"
                variant="text"
                icon="mdi-plus"
            ></v-btn>
        </v-app-bar>
        <AppSidebar v-model="drawer" />
        <v-main :scrollable="true" :class="smAndDown && 'pb-16'">
            <v-progress-linear
                v-if="useUserStore().isLoading"
                indeterminate
                color="yellow darken-2"
            ></v-progress-linear
            ><v-container
                v-else
                :fluid="true"
                class="pa-0"
                :class="lgAndUp && 'w-75'"
            >
                <router-view :key="useRoute().fullPath" />
            </v-container>
        </v-main>
        <NavigationDrawer
            v-if="smAndDown"
            @showAddDialog="showDialog = true"
        ></NavigationDrawer>
        <TaskDialog v-if="showDialog" v-model="showDialog" />
        <ReloadPrompt />
    </v-app>
    <v-app v-else>
        <v-container class="d-flex justify-center align-center flex-grow-1">
            <div
                class="d-flex flex-column align-center"
                v-if="!userStore.isLoggedIn"
            >
                <v-img
                    src="./assets/icons/icon-144x144.png"
                    :width="144"
                    aspect-ratio="1/1"
                ></v-img>
                <v-btn
                    class="mt-4"
                    @click="userStore.login"
                    append-icon="mdi-login"
                    >LOGIN WITH GOOGLE</v-btn
                >
            </div>
            <div class="mt-4" v-else>
                <v-progress-circular
                    indeterminate
                    model-value="20"
                    :size="128"
                ></v-progress-circular>
            </div>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useUserStore } from './stores/userStore';
import { useAppStore } from './stores/appStore';
import { useDisplay, useTheme } from 'vuetify';
import AppSidebar from '@/components/AppSidebar/AppSidebar.vue';
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import ReloadPrompt from '@/components/ReloadPrompt.vue';
import router from './router';
import NavigationDrawer from '@/components/NavigationDrawer.vue';
import { DataStorage } from './plugins/dataStorage';

const { lgAndUp, smAndDown } = useDisplay();
const showDialog = ref(false);
const drawer = ref(true);
const userStore = useUserStore();
const appStore = useAppStore();
const theme = useTheme();

onBeforeMount(async () => {
    await userStore.getAuthState();
    await appStore.syncFirebase();
});

onMounted(() => {
    const currentTheme = DataStorage.get('theme');
    if (currentTheme !== null) {
        useTheme().global.name.value = currentTheme;
    }
});

function toggleDrawer() {
    drawer.value = !drawer.value;
}

function getRouteName(): string {
    const name = router.currentRoute.value.name;
    let result = '';
    if (name) {
        if (name == 'group') {
            const id = router.currentRoute.value.params.id;
            result = appStore.getGroupById(id as string)?.name as string;
        } else {
            result = router.currentRoute.value.name as string;
        }
    }

    return result;
}
</script>

<style scoped>
#routeName {
    text-transform: capitalize;
}
</style>
