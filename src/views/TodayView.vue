<template>
    <DisplayTasks :tasks="tasks" :meta-id="'today'" />
</template>

<script setup lang="ts">
import DisplayTasks from '@/components/shared/DisplayTasks.vue';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';

const store = useAppStore();
const tasks = computed(() => store.getTodayTasks());
</script>

<style scoped></style>
