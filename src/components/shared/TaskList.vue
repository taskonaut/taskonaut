<template>
    <v-list select-strategy="leaf">
        <v-list-subheader v-if="props.subheader">
            {{ props.subheader }}
        </v-list-subheader>
        <v-list-item
            v-for="task in props.tasks"
            :key="task.uuid"
            :title="task.header"
            :subtitle="task.body || undefined"
            :value="task.uuid"
            :active="task.complete"
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
                <DateChip :date="task.dueDate" />
                <v-btn icon="mdi-dots-vertical" variant="text" />
                <TaskDialog :task="task" />
            </template>
        </v-list-item>
        <slot></slot>
    </v-list>
</template>

<script setup lang="ts">
import type { Task } from '@/model';
import TaskDialog from '../TaskDialog.vue';
import DateChip from '../partials/DateChip.vue';
import { useAppStore } from '@/stores/appStore';

const props = defineProps<{
    subheader?: string;
    tasks: Task[];
}>();

const appStore = useAppStore();
function toggleTask(taskId: string) {
    appStore.toggleTask(taskId);
}
</script>

<style scoped></style>
