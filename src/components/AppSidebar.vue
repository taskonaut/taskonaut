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
                :active="false"
            >
            </v-list-item>
        </v-list>
        <v-list density="compact" nav select-strategy="single-leaf">
            <v-list-subheader>PROJECTS</v-list-subheader>
            <v-list-item
                v-for="list in lists"
                :key="list.uuid"
                :prependIcon="'mdi-circle-small'"
                :title="list.name"
                :value="list.name"
                :active="false"
            >
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../stores/appStore';

export interface Props {
    drawer: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    drawer: true,
});

const store = useAppStore();
const lists = computed(() => store.getLists);
const menuItems = [
    { title: 'Inbox', icon: 'mdi-home-city', value: 'inbox' },
    { title: 'Today', icon: 'mdi-account', value: 'today' },
    { title: 'Upcoming', icon: 'mdi-account-group-outline', value: 'upcoming' },
    { title: 'Calendar', icon: 'mdi-calendar', value: 'calendar' },
];
</script>
