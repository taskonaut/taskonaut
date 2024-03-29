<template>
    <div class="navigation-drawer">
        <div class="button-container">
            <v-badge
                :model-value="incomingCount > 0"
                :content="incomingCount"
                color="surface"
                offset-y="12"
                offset-x="12"
            >
                <v-btn
                    icon
                    variant="text"
                    @click="switchRoute('inbox')"
                    :color="
                        router.currentRoute.value.name === 'inbox'
                            ? 'primary'
                            : 'none'
                    "
                >
                    <v-icon>mdi-inbox-arrow-down</v-icon>
                </v-btn>
            </v-badge>
            <v-badge
                :model-value="todayCount > 0"
                :content="todayCount"
                color="surface"
                offset-y="12"
                offset-x="12"
            >
                <v-btn
                    icon
                    variant="text"
                    @click="switchRoute('today')"
                    :color="
                        router.currentRoute.value.name === 'today'
                            ? 'primary'
                            : 'none'
                    "
                    ><v-icon>mdi-calendar-clock</v-icon>
                </v-btn>
            </v-badge>
            <v-btn icon color="primary" @click="$emit('showAddDialog')"
                ><v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-badge
                :model-value="upcomingCount > 0"
                :content="upcomingCount"
                color="surface"
                offset-y="12"
                offset-x="12"
            >
                <v-btn
                    icon
                    variant="text"
                    @click="switchRoute('upcoming')"
                    :color="
                        router.currentRoute.value.name === 'upcoming'
                            ? 'primary'
                            : 'none'
                    "
                    ><v-icon>mdi-view-week</v-icon>
                </v-btn>
            </v-badge>
            <v-badge
                :model-value="expiredCount > 0"
                :content="expiredCount"
                color="surface"
                offset-y="12"
                offset-x="12"
            >
                <v-btn
                    icon
                    variant="text"
                    @click="switchRoute('expired')"
                    :color="
                        router.currentRoute.value.name === 'expired'
                            ? 'primary'
                            : 'none'
                    "
                    ><v-icon>mdi-clock</v-icon>
                </v-btn>
            </v-badge>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';

const incomingCount = computed(
    () =>
        useAppStore()
            .getInboxTasks()
            .filter((task) => !task.complete).length
);

const todayCount = computed(
    () =>
        useAppStore()
            .getTodayTasks()
            .filter((task) => !task.complete).length
);

const upcomingCount = computed(
    () =>
        useAppStore()
            .getUpcomingTasks()
            .filter((task) => !task.complete).length
);

const expiredCount = computed(
    () =>
        useAppStore()
            .getExpiredTasks()
            .filter((task) => !task.complete).length
);

function switchRoute(routeName: string) {
    if (router.hasRoute(routeName)) router.push({ name: routeName });
}
</script>
<style scoped>
.navigation-drawer {
    position: fixed;
    display: flex;
    align-items: flex-end;
    direction: ltr;
    bottom: 0;
    width: 100%;
    z-index: 1;
    height: 64px;
    background-color: var(--v-theme-background);
    box-shadow: 0px 2px 4px 2px
            var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
        0px 4px 5px 0px
            var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
        0px 1px 10px 0px
            var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}

.button-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    flex-basis: 100%;
    transition: all 0.3s;
}

.btn {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.v-btn {
    transition: all 0.2s ease-in-out;
}
</style>
