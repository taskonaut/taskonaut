<template>
    <task-list v-if="group" v-model="group.tasks" />
</template>

<script setup lang="ts">
import TaskList from '@/components/shared/TaskList.vue';
import router from '@/router';
import { computed, onUnmounted, watch } from 'vue';
import { onGroup, updateGroup } from '@/services/firebase.service';

const groupId = computed(() => router.currentRoute.value.params.id as string);
const { group, unsubscribe } = onGroup(groupId.value);

watch(
    group,
    (value) => {
        updateGroup(value!);
    },
    { deep: true }
);

onUnmounted(() => {
    unsubscribe();
});
</script>
