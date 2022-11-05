<template>
    <DisplayTasks :tasks="tasks" :group-id="groupId" />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DisplayTasks from '../components/shared/DisplayTasks.vue';

const store = useAppStore();

const groupId = computed(() => useRoute().params.id as string);
const tasks = computed(() => store.getGroupTasks(groupId.value));
</script>

<style scoped></style>
