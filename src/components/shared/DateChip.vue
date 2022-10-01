<template>
    <v-chip size="x-small" :color="color" label v-if="props.date">{{
        `${new Date(props.date).getDate()} / ${
            new Date(props.date).getMonth() + 1
        }`
    }}</v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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
        return 'yellow';
    } else {
        return 'gray';
    }
});
</script>

<style scoped></style>
