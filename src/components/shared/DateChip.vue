<template>
    <v-chip size="x-small" :color="color" label v-if="props.date">{{
        `${date.getShortDate(props.date)}   ${date.getWeekDay(props.date)}`
    }}</v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as date from '@/services/date.service';

const props = defineProps<{
    date: undefined | number;
}>();

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

const propDate = new Date(props.date as number);
propDate.setUTCHours(0, 0, 0, 0);

const dueToday = computed(() => today.getTime() == propDate.getTime());

const expired = computed(() => today.getTime() > propDate.getTime());

const color = computed(() => {
    if (expired.value) {
        return 'red';
    } else if (dueToday.value) {
        return 'warning';
    } else {
        return 'accent';
    }
});
</script>

<style scoped></style>
