<template>
    <task-list v-if="inbox" v-model="inbox" />
</template>

<script setup lang="ts">
import TaskList from '@/components/shared/TaskList.vue';
import { watch } from 'vue';
import { onInbox, updateInbox } from '@/services/firebase.service';
import { onUnmounted } from 'vue';

const { inbox, unsubscribe } = onInbox();

watch(
    inbox,
    (tasks) => {
        updateInbox(tasks);
    },
    { deep: true }
);

onUnmounted(() => {
    unsubscribe();
});
</script>
