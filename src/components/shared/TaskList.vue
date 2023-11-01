<template>
    <!-- Ongoing Tasks -->
    <draggable
        item-key="uuid"
        handle=".handle"
        :list="tasksRef"
        :group="{ name: 'subtasks' }"
    >
        <template #item="{ element }">
            <v-expand-transition v-show="displayTasks" class="ml-5">
                <task-item
                    :task="element"
                    :is-draggable="true"
                    @delete="deleteTask"
                />
            </v-expand-transition>
        </template>
    </draggable>
    <task-dialog v-model="showTaskDialog" />
</template>
<script setup lang="ts">
import TaskDialog from '../dialogs/TaskDialog.vue';
import draggable from 'vuedraggable';
import type { Task } from '@/model';
import { ref, watch } from 'vue';
import TaskItem from './TaskItem.vue';

const props = defineProps({
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
    hideAddButton: {
        type: Boolean,
        default: false,
    },
    subtasks: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{
    update: [tasks: Task[]];
}>();
const showTaskDialog = ref(false);

function deleteTask(id: string) {
    tasksRef.value = tasksRef.value.filter((task) => task.uuid !== id);
}

const tasksRef = ref<Task[]>(props.tasks);
watch(
    () => tasksRef.value,
    async (newState) => {
        emit('update', newState);
    },
    { deep: true }
);
</script>
