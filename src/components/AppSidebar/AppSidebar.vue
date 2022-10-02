<template>
    <v-navigation-drawer
        class="pl-4"
        width="300"
        :model-value="props.modelValue"
        :border="0"
        @update:model-value="(value) => emits('update:modelValue', value)"
    >
        <template v-slot:prepend>
            <v-list-item
                class="pt-5 pb-2"
                twoLine
                :prepend-avatar="photoURL"
                :title="displayName || 'Anonymous'"
                :subtitle="displayName ? 'Logged in' : 'Not logged in'"
            ></v-list-item>
        </template>
        <SidebarMainSection />
        <SidebarGroupSection />
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import SidebarMainSection from './partials/SidebarMainSection.vue';
import SidebarGroupSection from './partials/SidebarGroupSection.vue';

const props = defineProps<{
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const userStore = useUserStore();

const displayName = computed(() => userStore.displayName);
const photoURL = computed(() => userStore.photoURL as string);
</script>
