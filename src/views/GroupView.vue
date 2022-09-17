<template>
    <DisplayTasks :tasks="tasks">
        <template v-slot:list1-slot><AddListItem></AddListItem></template>
    </DisplayTasks>
</template>

<script setup lang="ts">
import DisplayTasks from '@/components/shared/DisplayTasks.vue';
import AddListItem from '../components/partials/AddListItem.vue';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const store = useAppStore();
const tasks = computed(() => store.getGroupTasks(useRoute().params.id[0]));
</script>

<style scoped></style>
