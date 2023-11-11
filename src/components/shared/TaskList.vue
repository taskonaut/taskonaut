<template>
    <div
        v-if="props.modelValue!.length < 1 && props.isTopLevel"
        class="d-flex h-100 justify-center align-center text-h4"
    >
        List is empty...
    </div>
    <draggable
        v-else
        item-key="uuid"
        handle=".handle"
        :animation="150"
        :swapThreshold="10"
        easing="cubic-bezier(1, 0, 0, 1)"
        :model-value="props.modelValue"
        @update:modelValue="(tasks) => emit('update:modelValue', tasks)"
        :group="{ name: 'tasks' }"
    >
        <template #item="{ element }">
            <div>
                <task-item
                    :task="element"
                    :is-draggable="true"
                    @delete="handleDeleteEvent"
                >
                    <v-sheet rounded>
                        <div class="ml-5">
                            <task-list
                                v-model="element.subtasks"
                                :is-top-level="false"
                            /></div
                    ></v-sheet>
                </task-item>
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
import { ref } from 'vue';
import TaskItem from './TaskItem.vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';

const props = defineProps({
    modelValue: {
        type: Array<any>,
    },
    isTopLevel: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits<{
    'update:modelValue': [any[]];
}>();

const showConfirmDialog = ref(false);
const taskId = ref();

function handleDeleteEvent(id: string) {
    taskId.value = id;
    showConfirmDialog.value = true;
}
function deleteTask() {
    const updatedTasks = props.modelValue?.filter(
        (task) => task.uuid !== taskId.value
    );
    emit('update:modelValue', updatedTasks!);
}
</script>
