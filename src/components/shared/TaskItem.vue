<template>
    <v-list-item
        :title="props.task.header"
        :subtitle="props.task.body || undefined"
        :value="props.task.uuid"
        :active="props.task.complete"
    >
        <template v-slot:prepend>
            <v-list-item-action>
                <v-icon
                    class="show-on-hover"
                    :end="true"
                    icon="mdi-dots-vertical"
                />
                <v-checkbox-btn
                    @change="toggleTask(task.uuid)"
                    :model-value="task.complete"
                ></v-checkbox-btn>
            </v-list-item-action>
        </template>
        <template v-slot:append>
            <DateChip :date="props.task.dueDate" />
            <div>
                <v-btn
                    icon="mdi-dots-horizontal"
                    variant="text"
                    @click="showDialog = true"
                />
            </div>
            <v-btn
                icon="mdi-delete"
                variant="text"
                @click="deleteTask(task.uuid)"
            />
        </template>
    </v-list-item>
    <div v-if="showDialog">
        <TaskDialog
            :task="task"
            :show-dialog="showDialog"
            @close-dialog="showDialog = false"
        />
    </div>
</template>

<script setup lang="ts">
import TaskDialog from '../TaskDialog.vue';
import DateChip from '../partials/DateChip.vue';
import type { Task } from '@/model';
import { useAppStore } from '@/stores/appStore';
import { ref } from 'vue';

const showDialog = ref(false);

const props = defineProps<{
    task: Task;
}>();

const appStore = useAppStore();
function toggleTask(taskId: string) {
    appStore.toggleTask(taskId);
}

function deleteTask(taskId: string) {
    appStore.deleteTask(taskId);
}
</script>

<style scoped>
.show-on-hover {
    opacity: 0;
}

.v-list-item:hover .show-on-hover {
    opacity: 100;
}
</style>
