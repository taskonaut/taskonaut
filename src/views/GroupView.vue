<template>
    <DisplayTasks :tasks="tasks" />
</template>

<script setup lang="ts">
import DisplayTasks from '@/components/shared/DisplayTasks.vue';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const store = useAppStore();
const tasks = computed(() =>
    store.getGroupTasks(useRoute().params.id as string)
);
</script>

<style scoped></style>
