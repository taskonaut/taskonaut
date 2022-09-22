<template>
    <v-navigation-drawer
        :model-value="props.modelValue"
        @update:model-value="(value) => emits('update:modelValue', value)"
    >
        <template v-slot:prepend>
            <!-- :prependAvatar="photoURL" -->
            <v-list-item
                twoLine
                :title="displayName || 'Anonymous'"
                :subtitle="displayName ? 'Logged in' : 'Not logged in'"
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
import { useUserStore } from '../stores/userStore';

const props = defineProps<{
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const store = useAppStore();
const userStore = useUserStore();

const displayName = computed(() => userStore.displayName);
//const photoURL = computed(() => userStore.photoURL as string);

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
