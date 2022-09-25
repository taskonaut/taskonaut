<template>
    <v-chip
        v-if="props.count"
        class="hide-on-hover"
        size="x-small"
        color="gray"
        label
        >{{ props.count }}
    </v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{
    count: number;
}>();
</script>

<style scoped></style>
