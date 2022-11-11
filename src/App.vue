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
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from './stores/userStore';
import { useAppStore } from './stores/appStore';
import { useDisplay, useTheme } from 'vuetify';
import AppSidebar from '@/components/AppSidebar/AppSidebar.vue';
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import ReloadPrompt from '@/components/ReloadPrompt.vue';
import router from './router';
import NavigationDrawer from '@/components/NavigationDrawer.vue';

const { lgAndUp, smAndDown } = useDisplay();
const showDialog = ref(false);
const drawer = ref(true);
const appStore = useAppStore();
const theme = useTheme();

onMounted(async () => {
    await useUserStore().getAuthState();
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
