<template>
    <v-app>
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
                @click="showDialog = true"
                variant="text"
                icon="mdi-plus"
            ></v-btn>
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
        <AppSidebar v-model="drawer" />
        <v-main :scrollable="true"
            ><v-container :fluid="true" class="pa-0" :class="lgAndUp && 'w-75'">
                <v-progress-linear
                    v-if="useUserStore().isLoading"
                    indeterminate
                    color="yellow darken-2"
                ></v-progress-linear
                ><router-view :key="useRoute().fullPath"
            /></v-container>
        </v-main>
        <TaskDialog v-if="showDialog" v-model="showDialog" />
    </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from './stores/userStore';
import { useAppStore } from './stores/appStore';
import { computed } from 'vue';
import { useDisplay, useTheme } from 'vuetify';
import AppSidebar from '@/components/AppSidebar/AppSidebar.vue';
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import router from './router';

const { lgAndUp } = useDisplay();

const showDialog = ref(false);

const drawer = ref(true);

const appStore = useAppStore();
const userStore = useUserStore();
const loggedIn = computed(() => userStore.isLoggedIn);
const theme = useTheme();

onMounted(() => {
    // Populate if groupOrder is empty (with group ids prior feature)
    if (!appStore.groupOrder.length) {
        appStore.groups.forEach((group) =>
            appStore.groupOrder.push(group.uuid)
        );
    }
});

function toggleDrawer() {
    drawer.value = !drawer.value;
}

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark
        ? 'customLightTheme'
        : 'customDarkTheme';
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
