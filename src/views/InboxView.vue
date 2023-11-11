<template>
    <task-list v-if="inbox" v-model="inbox" />
</template>

<script setup lang="ts">
import TaskList from '@/components/shared/TaskList.vue';
import { onUnmounted, watch } from 'vue';
import { onInbox, updateInbox } from '@/services/firebase.service';

const { inbox, unsubscribe } = onInbox();

onUnmounted(() => {
    unsubscribe();
});

watch(
    inbox,
    (tasks) => {
        updateInbox(tasks);
    },
    { deep: true }
);
</script>
