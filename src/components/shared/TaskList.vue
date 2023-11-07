<template>
    <draggable
        item-key="uuid"
        handle=".handle"
        :list="localTasks"
        :group="{ name: 'subtasks' }"
        @add="emitUpdate"
        @remove="emitUpdate"
        @update="emitUpdate"
    >
        <template #item="{ element }">
            <div>
                <task-item
                    :task="element"
                    :is-draggable="true"
                    @delete="handleDeleteEvent"
                    @update="emitUpdate"
                >
                    <v-sheet rounded>
                        <div class="ml-5">
                            <task-list
                                :tasks="element.subtasks"
                                @update="emitUpdate"
                            />
                        </div>
                    </v-sheet>
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
import type { Task } from '@/model';
import { ref, watch } from 'vue';
import TaskItem from './TaskItem.vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';
import { useAppStore } from '@/stores/appStore';

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

const localTasks = ref(props.tasks);

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
    emit('update', localTasks.value);
}
function emitUpdate() {
    emit('update', localTasks.value);
    console.log('emit update');
}
watch(
    () => useAppStore().isChanged,
    (value) => {
        if (value && props.topLevel) {
            console.log('props updated');
            localTasks.value = props.tasks;
            useAppStore().isChanged = false;
        }
    }
);
</script>
