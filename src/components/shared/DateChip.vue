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
    date: null | number;
}>();

const today = new Date();

const dueToday = computed(
    () => today.getUTCDate() >= new Date(props.date!).getUTCDate()
);
const color = computed(() => (dueToday.value ? 'pink' : 'gray'));
</script>

<style scoped></style>
