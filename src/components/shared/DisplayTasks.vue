<template>
    <TaskList :tasks="ongoingTasks" :subheader="'ONGOING'">
        <AddListItem v-if="!props.hideAddButton" />
    </TaskList>
    <v-divider v-if="completeTasks.length" />
    <div class="completed">
        <TaskList
            v-if="completeTasks.length"
            :tasks="completeTasks"
            :subheader="'COMPLETED'"
        />
    </div>
</template>
<script setup lang="ts">
import type { Task } from '@/model';
import { computed } from 'vue';
import TaskList from './TaskList.vue';
import AddListItem from './AddListItem.vue';

const props = defineProps<{
    tasks: Task[];
    hideAddButton?: boolean;
}>();

const ongoingTasks = computed(() =>
    props.tasks.filter((task) => !task.complete)
);
const completeTasks = computed(() =>
    props.tasks.filter((task) => task.complete)
);
</script>
<style scoped></style>
