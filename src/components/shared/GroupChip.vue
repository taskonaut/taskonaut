<template>
    <v-chip size="x-small" label>{{ groupName }}</v-chip>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const props = defineProps<{
    groupId: string;
}>();

function getGroupName(id: string) {
    return useUserStore().groupList.find((group) => group.uuid === id)?.name;
}

const groupName = computed(() => getGroupName(props.groupId));
</script>
