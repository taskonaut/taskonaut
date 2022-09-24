<template>
    <v-navigation-drawer
        :model-value="props.modelValue"
        @update:model-value="(value) => emits('update:modelValue', value)"
    >
        <template v-slot:prepend>
            <v-list-item
                twoLine
                :prepend-avatar="photoURL"
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
            <v-row class="justify-space-between align-center my-1 mx-1">
                <v-list-subheader
                    class="d-flex align-content-center"
                    title="PROJECTS"
                />
                <v-btn
                    :rounded="true"
                    size="x-small"
                    icon="mdi-plus"
                    variant="flat"
                    @click="groupDialog = true"
                />
            </v-row>
            <GroupItem
                v-for="group in groups"
                :key="group.uuid"
                :group="group"
            />
        </v-list>
        <GroupDialog v-model="groupDialog"></GroupDialog>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import router from '@/router';
import { computed, ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useUserStore } from '../stores/userStore';
import GroupDialog from './GroupDialog.vue';
import GroupItem from './shared/GroupItem.vue';

const props = defineProps<{
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const groupDialog = ref(false);
const store = useAppStore();
const userStore = useUserStore();

const displayName = computed(() => userStore.displayName);
const photoURL = computed(() => userStore.photoURL as string);

const groups = computed(() => store.getGroups);

const menuItems = [
    { title: 'Inbox', icon: 'mdi-inbox-arrow-down', value: 'inbox' },
    { title: 'Today', icon: 'mdi-calendar-clock', value: 'today' },
    { title: 'Upcoming', icon: 'mdi-view-week', value: 'upcoming' },
    //{ title: 'Calendar', icon: 'mdi-calendar', value: 'calendar' },
];

function switchRoute(routeName: string) {
    if (router.hasRoute(routeName)) router.push({ name: routeName });
}
</script>
