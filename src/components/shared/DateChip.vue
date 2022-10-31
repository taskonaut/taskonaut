<template>
    <v-chip size="x-small" :color="color" label v-if="props.date">{{
        `${date.getShortDate(props.date)}   ${date.getWeekDay(props.date)}`
    }}</v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as date from '@/services/date.service';

const props = defineProps<{
    date: number;
}>();

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
