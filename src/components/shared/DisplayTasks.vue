<template>
    <v-card rounded="lg">
        <TaskList :tasks="ongoingTasks" :subheader="'ONGOING'">
            <AddListItem />
        </TaskList>
        <v-divider></v-divider>
        <TaskList
            v-if="completeTasks.length"
            :tasks="completeTasks"
            :subheader="'COMPLETED'"
        />
    </v-card>
</template>
<script setup lang="ts">
import type { Task } from '@/model';
import { computed } from 'vue';
import TaskList from './TaskList.vue';
import AddListItem from '../partials/AddListItem.vue';

const props = defineProps<{
    tasks: Task[];
}>();

const ongoingTasks = computed(() =>
    props.tasks.filter((task) => !task.complete)
);
const completeTasks = computed(() =>
    props.tasks.filter((task) => task.complete)
);
</script>
<style scoped></style>
