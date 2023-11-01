<template>
    <!-- Ongoing Tasks -->
    <draggable
        item-key="uuid"
        handle=".handle"
        :list="tasksRef"
        :group="{ name: 'subtasks' }"
    >
        <template #item="{ element }">
            <div v-show="displayTasks" class="ml-5">
                <task-item :task="element" :is-draggable="true" />
            </div>
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
    metaId: { type: String },
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

const emits = defineEmits<{
    update: [tasks: Task[]];
}>();

const showTaskDialog = ref(false);

const tasksRef = ref<Task[]>(props.tasks);

watch(tasksRef.value, async (newState) => {
    emits('update', newState);
});
</script>
<style scoped></style>
