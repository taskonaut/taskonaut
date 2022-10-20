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
        <SwipeBottomNavigation
            v-if="smAndDown"
            swiper-color="orange"
            background-color="#212121"
            icon-color="orange"
            :options="options"
            v-model="selected"
        >
            <template #icon="{ props }">
                <v-icon>{{ props.icon }}</v-icon>
            </template>
        </SwipeBottomNavigation>
        <TaskDialog v-if="showDialog" v-model="showDialog" />
    </v-app>
    <ReloadPrompt />
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
import { SwipeBottomNavigation } from 'bottom-navigation-vue';
import 'bottom-navigation-vue/dist/style.css';

const { lgAndUp, smAndDown } = useDisplay();
const showDialog = ref(false);
const drawer = ref(true);
const appStore = useAppStore();
const theme = useTheme();

const selected = ref(1); // TODO: should depend on actual route
const options = [
    {
        id: 1,
        icon: 'mdi-inbox-arrow-down',
        title: 'Inbox',
        path: { name: 'inbox' },
    },
    {
        id: 2,
        icon: 'mdi-calendar-clock',
        title: 'Today',
        path: { name: 'today' },
    },
    {
        id: 3,
        icon: 'mdi-view-week',
        title: 'Upcoming',
        path: { name: 'upcoming' },
    },
    { id: 4, icon: 'mdi-clock', title: 'Expired', path: { name: 'expired' } },
    { id: 5, icon: 'mdi-cog', title: 'Settings', path: { name: 'settings' } },
];

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
.sm-btn-container-foreground {
    box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
        0px 4px 5px 0px
            var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
        0px 1px 10px 0px
            var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}
#routeName {
    text-transform: capitalize;
}
</style>
