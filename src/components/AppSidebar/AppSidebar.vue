<template>
    <v-navigation-drawer
        class="pl-4"
        width="300"
        :model-value="props.modelValue"
        :border="0"
        @update:model-value="(value: boolean) => emits('update:modelValue', value)"
    >
        <template v-slot:prepend>
            <v-list-item
                class="pt-5 pb-2"
                twoLine
                :prepend-avatar="user!.photoURL! || undefined"
                :title="user!.displayName || 'Anonymous'"
                :subtitle="user!.displayName ? 'Logged in' : 'Not logged in'"
            >
                <template v-slot:append>
                    <v-btn
                        variant="text"
                        icon="mdi-cog"
                        @click="router.push({ name: 'settings' })"
                    ></v-btn>
                </template>
            </v-list-item>
        </template>
        <sidebar-main-section />
        <suspense>
            <sidebar-group-section />
        </suspense>
        <sidebar-shared-group-section />
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import SidebarMainSection from './partials/SidebarMainSection.vue';
import SidebarGroupSection from './partials/SidebarGroupSection.vue';
import SidebarSharedGroupSection from './partials/SidebarSharedGroupSection.vue';
import router from '../../router';

const props = defineProps<{
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const { user } = useUserStore();
</script>
