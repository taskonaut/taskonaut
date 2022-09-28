<template>
    <v-card rounded="lg">
        <TaskList :tasks="ongoingTasks" :subheader="'ONGOING'">
            <AddListItem />
        </TaskList>
        <v-divider v-if="completeTasks.length" />
        <div class="completed">
            <TaskList
                v-if="completeTasks.length"
                :tasks="completeTasks"
                :subheader="'COMPLETED'"
            />
        </div>
    </v-card>
</template>
<script setup lang="ts">
import type { Task } from '@/model';
import { computed } from 'vue';
import TaskList from './TaskList.vue';
import AddListItem from './AddListItem.vue';

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
