<template>
    <v-list select-strategy="leaf"
        ><v-list-item
            v-for="task in tasks"
            :key="task.uuid"
            :title="task.header"
            :subtitle="task.body"
            :value="task.uuid"
        >
            <template v-slot:prepend="{ isActive }">
                <v-list-item-action start>
                    <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                </v-list-item-action>
            </template>
            <template v-slot:append>
                <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
            </template>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const store = useAppStore();
const tasks = computed(() => store.getListById(useRoute().params.id[0])?.tasks);
</script>

<style scoped></style>
