<template>
    <v-list select-strategy="leaf" bg-color="background">
        <v-list-subheader v-if="props.subheader">
            {{ props.subheader }}
        </v-list-subheader>
        <template v-for="(task, index) in tasks" :key="task.uuid">
            <TaskItem :task="task" />
            <v-divider
                v-if="index < tasks.length - 1"
                :key="`${index}-divider`"
            />
        </template>
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
