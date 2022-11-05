<template>
    <TaskList
        :tasks="ongoingTasks"
        :group-id="props.groupId"
        :subheader="'ONGOING'"
    >
        <AddListItem v-if="!props.hideAddButton && !smAndDown" />
    </TaskList>
    <v-divider v-if="completeTasks.length && !smAndDown" />
    <div class="completed">
        <TaskList
            v-if="completeTasks.length"
            :tasks="completeTasks"
            :subheader="'COMPLETED'"
        />
    </div>
</template>
<script setup lang="ts">
import type { Task } from '@/model';
import { computed } from 'vue';
import TaskList from './TaskList.vue';
import AddListItem from './AddListItem.vue';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay();

const props = defineProps<{
    tasks: Task[];
    groupId?: string;
    hideAddButton?: boolean;
}>();

const ongoingTasks = computed(() =>
    props.tasks.filter((task) => !task.complete)
);
const completeTasks = computed(() =>
    props.tasks.filter((task) => task.complete)
);
</script>
<style scoped></style>
