<template>
    <v-chip size="x-small" :color="color" label v-if="props.task.dueDate!">{{
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

const chipDate = computed(() =>
    date.isToday(props.task.dueDate!)
        ? 'Today'
        : date.isUpcomingDate(props.task.dueDate!, 1)
        ? 'Tomorrow'
        : date.isUpcomingDate(props.task.dueDate!, 7)
        ? date.getWeekDay(props.task.dueDate!)
        : date.getShortDate(props.task.dueDate!)
);
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
