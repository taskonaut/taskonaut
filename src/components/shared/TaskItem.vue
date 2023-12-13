<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div>
        <v-sheet
            class="task-item ma-1"
            rounded="rounded"
            color="transparent"
            :class="task.complete && 'complete'"
        >
            <div class="d-flex flex-column flex-col pa-2">
                <div class="d-flex">
                    <div class="d-flex align-center">
                        <v-icon
                            v-if="props.isDraggable"
                            class="handle mr-2"
                            :end="true"
                            icon="mdi-drag"
                            :size="props.size || 'default'"
                        />
                        <v-badge
                            v-if="subtaskCount > 0 && !showTasks"
                            :content="subtaskCount"
                            inline
                        />
                        <v-checkbox-btn
                            @change="toggleTask"
                            :model-value="props.task.complete"
                            true-icon="mdi-checkbox-marked-circle-outline"
                            false-icon="mdi-checkbox-blank-circle-outline"
                        />
                    </div>
                    <div
                        @click="showTasks = !showTasks"
                        class="d-flex flex-column flex-grow-1 ml-3 justify-center"
                    >
                        <div class="text-body-1">{{ props.task.name }}</div>
                        <div v-if="props.task.description" class="text-caption">
                            {{ props.task.description }}
                        </div>
                    </div>
                    <div class="d-flex align-center">
                        <v-btn
                            size="small"
                            icon="mdi-plus"
                            variant="text"
                            @click="null"
                            class="show-on-hover"
                        />
                        <v-btn
                            size="small"
                            icon="mdi-dots-horizontal"
                            variant="text"
                            @click="editTask"
                            class="show-on-hover"
                        />
                        <v-btn
                            size="small"
                            icon="mdi-delete"
                            variant="text"
                            @click="handleDeleteTask"
                            class="show-on-hover"
                        />
                        <date-chip :task="props.task" class="hide-on-hover" />
                    </div>
                </div>
            </div>
        </v-sheet>
        <v-expand-transition
            v-show="showTasks"
            :disabled="task.subtasks.length === 0"
        >
            <v-sheet rounded>
                <div class="ml-5">
                    <task-list
                        v-model="task.subtasks"
                        :is-top-level="false"
                    /></div
            ></v-sheet>
        </v-expand-transition>
    </div>
</template>

<script setup lang="ts">
import TaskList from './TaskList.vue';
import DateChip from './DateChip.vue';
import useConfirmDialog from '@/composables/confirmDialog';
import useTaskDialog from '@/composables/taskDialog';
import type { Task } from '@/model';
import { deleteTask } from '@/services/firebase.service';
import { computed, ref } from 'vue';

const props = defineProps<{
    task: Task;
    isDraggable?: boolean;
    size?: string; // TODO: finish this
}>();

const { state: taskDialog } = useTaskDialog();
const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

const showTasks = ref(true);
const subtaskCount = computed(() => props.task.subtasks.length);

function toggleTask() {
    // eslint-disable-next-line vue/no-mutating-props
    props.task.complete = !props.task.complete;
}

function editTask() {
    taskDialog.task = props.task;
    taskDialog.isOpen = true;
}

async function handleDeleteTask() {
    const deleteConfirmDialog = {
        message: 'Are you sure you want to delete this task?',
        title: 'Delete task?',
        callback: async () => {
            await deleteTask(props.task);
            closeConfirmDialog();
        },
    };
    openConfirmDialog(deleteConfirmDialog);
}
</script>

<style scoped>
.hidden-opacity {
    opacity: 0%;
}

.task-item:hover .shown-opacity {
    opacity: 100%;
}

.show-on-hover {
    display: none;
}

.task-item:hover .show-on-hover {
    display: flex;
}

.hide-on-hover {
    display: flex;
}

.task-item:hover .hide-on-hover {
    display: none;
}

.complete {
    opacity: 40%;
}
</style>
