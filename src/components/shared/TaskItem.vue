<template>
    <v-list-item
        :title="task!.header"
        :subtitle="task!.body || undefined"
        :value="task!.uuid"
        :active="task!.complete"
    >
        <template v-slot:prepend>
            <v-list-item-action>
                <v-icon
                    class="show-on-hover handle"
                    :end="true"
                    icon="mdi-dots-vertical"
                />
                <v-checkbox-btn
                    @change="toggleTask(task!.uuid)"
                    :model-value="task!.complete"
                ></v-checkbox-btn>
            </v-list-item-action>
        </template>
        <template v-slot:append>
            <DateChip :date="task!.dueDate" />
            <v-btn
                icon="mdi-dots-horizontal"
                variant="text"
                @click="showDialog = true"
                class="show-on-hover"
            />
            <v-btn
                icon="mdi-delete"
                variant="text"
                @click="deleteTask(task!.uuid)"
                class="show-on-hover"
            />
        </template>
    </v-list-item>
    <div v-if="showDialog">
        <TaskDialog :task="task" v-model="showDialog" />
    </div>
</template>

<script setup lang="ts">
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import DateChip from '@/components/shared/DateChip.vue';
import type { Task } from '@/model';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { ref } from 'vue';

const showDialog = ref(false);

const props = defineProps<{
    task: Task;
}>();

const appStore = useAppStore();
const task = computed(() => appStore.getTaskById(props.task.uuid));

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
