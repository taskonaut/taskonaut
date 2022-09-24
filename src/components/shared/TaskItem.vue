<template>
    <v-list-item
        :title="props.task.header"
        :subtitle="props.task.body || undefined"
        :value="props.task.uuid"
        :active="props.task.complete"
    >
        <template v-slot:prepend>
            <v-list-item-action start>
                <v-checkbox-btn
                    @change="toggleTask(task.uuid)"
                    :model-value="task.complete"
                ></v-checkbox-btn>
            </v-list-item-action>
        </template>
        <template v-slot:append>
            <DateChip :date="props.task.dueDate" />
            <v-btn icon="mdi-dots-vertical" variant="text" />
            <TaskDialog :task="task" />
        </template>
    </v-list-item>
</template>

<script setup lang="ts">
import TaskDialog from '../TaskDialog.vue';
import DateChip from '../partials/DateChip.vue';
import type { Task } from '@/model';
import { useAppStore } from '@/stores/appStore';

const props = defineProps<{
    task: Task;
}>();

const appStore = useAppStore();
function toggleTask(taskId: string) {
    appStore.toggleTask(taskId);
}
</script>

<style scoped></style>
