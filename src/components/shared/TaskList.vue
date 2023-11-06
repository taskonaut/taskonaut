<template>
    <draggable
        item-key="uuid"
        handle=".handle"
        :list="localTasks"
        :group="{ name: 'subtasks' }"
    >
        <template #item="{ element }">
            <div>
                <task-item
                    :task="element"
                    :is-draggable="true"
                    @delete="handleDeleteEvent"
                />
                <v-sheet rounded>
                    <div class="ml-5">
                        <task-list :tasks="element.subtasks" />
                    </div>
                </v-sheet>
            </div>
        </template>
    </draggable>
    <confirm-dialog
        v-model="showConfirmDialog"
        title="Delete?"
        message="Are you sure you want to delete this task?"
        @confirm="deleteTask"
    ></confirm-dialog>
</template>
<script setup lang="ts">
import draggable from 'vuedraggable';
import type { Task } from '@/model';
import { ref, watch } from 'vue';
import TaskItem from './TaskItem.vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';

const props = defineProps({
    topLevel: {
        required: false,
        type: Boolean,
        default: false,
    },
    displayTasks: {
        required: false,
        type: Boolean,
        default: true,
    },
    tasks: {
        required: true,
        type: Array<Task>,
    },
    drag: {
        type: Boolean,
        default: true,
    },
});

let localTasks = ref(props.tasks);

const emit = defineEmits<{
    update: [tasks: Task[]];
    delete: [uuid: string];
}>();

const showConfirmDialog = ref(false);
const taskId = ref();

function handleDeleteEvent(id: string) {
    taskId.value = id;
    showConfirmDialog.value = true;
}
function deleteTask() {
    const index = localTasks.value.findIndex(
        (task) => task.uuid === taskId.value
    );
    localTasks.value.splice(index, 1);
}
watch(
    () => props.tasks,
    (tasks: Task[]) => {
        localTasks.value = tasks;
    },
    { deep: true }
);

watch(
    localTasks,
    (tasks) => {
        if (props.topLevel) emit('update', tasks);
    },
    { deep: true }
);
</script>
