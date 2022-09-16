<template>
    <v-navigation-drawer app bottom :model-value="props.drawer">
        <template v-slot:prepend>
            <v-list-item
                twoLine
                prependAvatar="https://randomuser.me/api/portraits/women/81.jpg"
                title="Jane Smith"
                subtitle="Logged in"
            ></v-list-item>
        </template>
        <v-divider></v-divider>
        <v-list density="compact" nav>
            <v-list-item
                v-for="item in menuItems"
                :key="item.title"
                :prependIcon="item.icon"
                :title="item.title"
                :value="item.value"
                :active="router.currentRoute.value.name == item.value"
                @click="switchRoute(item.value)"
            >
            </v-list-item>
        </v-list>
        <v-list density="compact" nav select-strategy="single-leaf">
            <v-list-subheader>PROJECTS</v-list-subheader>
            <v-list-item
                v-for="group in groups"
                :key="group.uuid"
                :prependIcon="'mdi-file-document'"
                :title="group.name"
                :value="group.name"
                :active="group.uuid == router.currentRoute.value.name"
                @click="switchGroupRoute(group.uuid)"
            >
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import router from '@/router';
import { computed } from 'vue';
import { useAppStore } from '../stores/appStore';

export interface Props {
    drawer: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    drawer: true,
});

const store = useAppStore();
const groups = computed(() => store.getGroups);

const menuItems = [
    { title: 'Inbox', icon: 'mdi-home-city', value: 'inbox' },
    { title: 'Today', icon: 'mdi-account', value: 'today' },
    { title: 'Upcoming', icon: 'mdi-account-group-outline', value: 'upcoming' },
    { title: 'Calendar', icon: 'mdi-calendar', value: 'calendar' },
];

function switchGroupRoute(listId: string) {
    router.push({ name: 'group', params: { id: listId } });
}

function switchRoute(routeName: string) {
    if (router.hasRoute(routeName)) router.push({ name: routeName });
}
</script>
