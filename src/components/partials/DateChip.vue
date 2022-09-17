<template>
    <v-chip size="x-small" :color="color" label v-if="props.date">{{
        `${props.date.getDate()} / ${props.date.getMonth()}`
    }}</v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    date: null | Date;
}>();

const today = new Date();

const dueToday = computed(() => today.getUTCDate() >= props.date!.getUTCDate());
const color = computed(() => (dueToday.value ? 'pink' : 'gray'));
</script>

<style scoped></style>
