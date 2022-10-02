<template>
    <v-list select-strategy="leaf" bg-color="background">
        <v-list-subheader v-if="props.subheader">
            {{ props.subheader }}
        </v-list-subheader>
        <TaskItem v-for="task in tasks" :key="task.uuid" :task="task" />
        <slot></slot>
    </v-list>
</template>

<script setup lang="ts">
import type { Task } from '@/model';
import TaskItem from './TaskItem.vue';

const props = defineProps<{
    subheader?: string;
    tasks: Task[];
}>();
</script>

<style scoped></style>
