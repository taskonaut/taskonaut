<template>
    <v-chip v-if="task.dueDate" size="small" :color="color" label>{{
        chipDate
    }}</v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as date from '@/services/date.service';
import type { Task } from '@/model';

const props = defineProps<{
    task: Task;
}>();

const chipDate = computed(() => {
    if (date.isPastDate(props.task.dueDate!)) {
        return `${date.daysPass(props.task.dueDate!)} day${
            date.daysPass(props.task.dueDate!) > 1 ? 's' : ''
        } overdue`;
    }
    if (date.isToday(props.task.dueDate!)) {
        return `Due today`;
    }
    return `Due on ${date.getLocalDate(props.task.dueDate!)}`;
});
const color = computed(() => {
    if (date.isPastDate(props.task.dueDate!) && !props.task?.complete) {
        return 'red';
    } else if (date.isToday(props.task.dueDate!) && !props.task?.complete) {
        return 'warning';
    } else {
        return 'accent';
    }
});
</script>

<style scoped></style>
