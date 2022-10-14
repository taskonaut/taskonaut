<template>
    <DisplayTasks :tasks="tasks" :hideAddButton="true" />
</template>

<script setup lang="ts">
import DisplayTasks from '@/components/shared/DisplayTasks.vue';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';

const store = useAppStore();
const tasks = computed(() => store.getExpiredTasks());
</script>

<style scoped></style>
