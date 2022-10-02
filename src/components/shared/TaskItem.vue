<template>
    <v-list-item
        :subtitle="task!.body || undefined"
        :value="task!.uuid"
        :active="false"
        :height="60"
        :class="task.complete && 'complete'"
    >
        <span :class="task.complete && 'complete-text'">{{
            task!.header
        }}</span>
        <template v-slot:prepend>
            <v-list-item-action>
                <v-icon
                    class="hidden-opacity handle"
                    :class="!task.complete && 'shown-opacity'"
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
            <DateChip :date="task!.dueDate" class="hide-on-hover" />
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
        <TaskDialog v-if="showDialog" :task="task" v-model="showDialog" />
    </v-list-item>
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
.hidden-opacity {
    opacity: 0%;
}

.v-list-item:hover .shown-opacity {
    opacity: 100%;
}

.show-on-hover {
    display: none;
}

.v-list-item:hover .show-on-hover {
    display: flex;
}

.hide-on-hover {
    display: flex;
}

.v-list-item:hover .hide-on-hover {
    display: none;
}

.complete-text {
    text-decoration: line-through;
}

.complete {
    opacity: 40%;
}
</style>
