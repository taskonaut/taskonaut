<template>
    <v-chip size="x-small" :color="color" label v-if="props.date">{{
        chipDate
    }}</v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as date from '@/services/date.service';

const props = defineProps<{
    date: number;
}>();

const chipDate = computed(() =>
    date.isToday(props.date)
        ? 'Today'
        : date.isUpcomingDate(props.date, 1)
        ? 'Tomorrow'
        : date.isUpcomingDate(props.date, 7)
        ? date.getWeekDay(props.date)
        : date.getShortDate(props.date)
);
const color = computed(() => {
    if (date.isPastDate(props.date)) {
        return 'red';
    } else if (date.isToday(props.date)) {
        return 'warning';
    } else {
        return 'accent';
    }
});
</script>

<style scoped></style>
