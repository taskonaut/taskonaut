<template>
    <v-chip size="x-small" label>{{ groupName }}</v-chip>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';

const props = defineProps<{
    groupId: string;
}>();

const group = computed(() => useAppStore().getGroupById(props.groupId));
const groupName = computed(() =>
    group.value ? useAppStore().getGroupById(props.groupId)!.name : ''
);
</script>
