<template>
    <v-list density="compact" nav>
        <!-- Inbox -->
        <v-list-item
            title="Inbox"
            prepend-icon="mdi-inbox-arrow-down"
            :active="router.currentRoute.value.name == 'inbox'"
            @click="switchRoute('inbox')"
            ><template v-slot:append>
                <TaskCounter :count="inboxCount" />
            </template>
        </v-list-item>
        <!-- Today -->
        <v-list-item
            title="Today"
            prepend-icon="mdi-calendar-clock"
            :active="router.currentRoute.value.name == 'today'"
            @click="switchRoute('today')"
            ><template v-slot:append>
                <TaskCounter :count="todayCount" />
            </template>
        </v-list-item>
        <!-- Upcoming -->
        <v-list-item
            title="Upcoming"
            prepend-icon="mdi-view-week"
            :active="router.currentRoute.value.name == 'upcoming'"
            @click="switchRoute('upcoming')"
            ><template v-slot:append>
                <TaskCounter :count="upcomingCount" />
            </template>
        </v-list-item>
        <!-- Expired -->
        <v-list-item
            title="Expired"
            prepend-icon="mdi-clock"
            :active="router.currentRoute.value.name == 'expired'"
            @click="switchRoute('expired')"
            ><template v-slot:append>
                <TaskCounter :count="expiredCount" />
            </template>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import TaskCounter from './partials/TaskCounter.vue';

//{ title: 'Calendar', icon: 'mdi-calendar', value: 'calendar' },

const appStore = useAppStore();
const inboxCount = computed(
    () => appStore.getInboxTasks().filter((task) => !task.complete).length
);
const todayCount = computed(
    () => appStore.getTodayTasks().filter((task) => !task.complete).length
);
const upcomingCount = computed(
    () => appStore.getUpcomingTasks().filter((task) => !task.complete).length
);
const expiredCount = computed(
    () => appStore.getExpiredTasks().filter((task) => !task.complete).length
);

function switchRoute(routeName: string) {
    if (router.hasRoute(routeName)) router.push({ name: routeName });
}
</script>

<style scoped></style>
