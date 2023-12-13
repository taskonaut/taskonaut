<template>
    <v-app v-if="userStore.isLoggedIn">
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
                <span id="routeName">{{ routeName }}</span>
            </v-toolbar-title>
            <v-btn
                v-if="$router.currentRoute.value.name !== 'settings'"
                @click="taskDialog.isOpen = !taskDialog.isOpen"
                variant="text"
                icon="mdi-plus"
            ></v-btn>
        </v-app-bar>
        <app-sidebar v-model="drawer" />
        <v-main :scrollable="true" :class="smAndDown && 'pb-16'">
            <v-progress-linear
                v-if="useUserStore().isLoading"
                indeterminate
                color="yellow darken-2"
            ></v-progress-linear
            ><v-container
                v-else
                :fluid="true"
                class="pa-0 d-flex flex-column h-100"
                :class="lgAndUp && 'w-75'"
            >
                <suspense>
                    <router-view :key="useRoute().fullPath" />
                </suspense>
            </v-container>
        </v-main>
        <navigation-drawer
            v-if="smAndDown"
            @showAddDialog="showDialog = true"
        />
        <app-confirm-dialog />
        <app-task-dialog />

        <reload-prompt />
    </v-app>
    <!-- Login Screen -->
    <v-app v-else>
        <v-container class="d-flex justify-center align-center flex-grow-1">
            <div
                class="d-flex flex-column align-center"
                v-if="!userStore.isLoggedIn && !userStore.isLoading"
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
            <div
                class="mt-4"
                v-if="!userStore.isLoggedIn && userStore.isLoading"
            >
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
import AppTaskDialog from './components/dialogs/TaskDialog.vue';
import AppConfirmDialog from './components/dialogs/ConfirmDialog.vue';
import { useRoute } from 'vue-router';
import { computed, onBeforeMount, ref } from 'vue';
import { useUserStore } from './stores/userStore';
import { useDisplay, useTheme } from 'vuetify';
import AppSidebar from '@/components/AppSidebar/AppSidebar.vue';
import ReloadPrompt from '@/components/ReloadPrompt.vue';
import NavigationDrawer from '@/components/NavigationDrawer.vue';
import { DataStorage } from './plugins/dataStorage';
import router from './router';
import useTaskDialog from './composables/taskDialog';

const { lgAndUp, smAndDown } = useDisplay();
const showDialog = ref(false);
const drawer = ref(true);
const userStore = useUserStore();
const theme = useTheme();
const { state: taskDialog } = useTaskDialog();

onBeforeMount(async () => {
    await userStore.getAuthState();
    const currentTheme = DataStorage.get('theme');
    if (currentTheme !== null) {
        useTheme().global.name.value = currentTheme;
    }
});

const routeName = computed(() => {
    const route = router.currentRoute.value;
    return route.name === 'group'
        ? getGroupName(route.params.id.toString())
        : route.name;
});

function getGroupName(id: string) {
    return useUserStore().groupList.find((group) => group.uuid === id)?.name;
}

function toggleDrawer() {
    drawer.value = !drawer.value;
}
</script>

<style scoped>
#routeName {
    text-transform: capitalize;
}
</style>
