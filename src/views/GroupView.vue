<template>
    <TaskList v-if="group" v-model="group!.tasks" :top-level="true" />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore';
import { onSnapshot, doc } from '@firebase/firestore';
import { db } from '@/includes/firebase';
import TaskList from '@/components/shared/TaskList.vue';
import router from '@/router';
import { computed, onUnmounted, ref, watch } from 'vue';
import type { Group } from '@/model';
import { onMounted } from 'vue';

const groupId = computed(() => router.currentRoute.value.params.id as string);

const group = ref();
let unsubscribe: Function;

onMounted(() => {
    unsubscribe = onSnapshot(doc(db, 'groups', groupId.value), (doc) => {
        group.value = doc.data() as unknown as Group;
    });
});

onUnmounted(() => {
    unsubscribe();
});

watch(
    group,
    (group) => {
        useAppStore().updateGroup(group);
    },
    { deep: true }
);
</script>
