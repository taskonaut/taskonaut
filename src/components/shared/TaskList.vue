<template>
    <v-list select-strategy="leaf" class="tasks-list">
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

<style>
.tasks-list .v-list-item__overlay {
    display: none;
}
.tasks-list .v-list-item--active .v-list-item-title {
    text-decoration: line-through;
}
</style>
