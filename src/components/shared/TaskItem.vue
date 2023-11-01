<template>
    <div>
        <v-sheet
            class="task-item ma-1"
            rounded="rounded"
            color="transparent"
            :class="taskRef.complete && 'complete'"
            @click="showTasks = !showTasks"
        >
            <div class="d-flex flex-column flex-col pa-2">
                <div class="d-flex">
                    <div class="d-flex align-center">
                        <v-icon
                            v-if="props.isDraggable"
                            class="handle mr-2"
                            :end="true"
                            icon="mdi-drag"
                        />
                        <v-checkbox-btn
                            @change="toggleTask()"
                            :model-value="taskRef.complete"
                            true-icon="mdi-checkbox-marked-circle-outline"
                            false-icon="mdi-checkbox-blank-circle-outline"
                        />
                    </div>
                    <div
                        class="d-flex flex-column flex-grow-1 ml-3 justify-center"
                    >
                        <div class="text-body-1">{{ taskRef.header }}</div>
                        <div v-if="taskRef.body" class="text-caption">
                            {{ taskRef.body }}
                        </div>
                    </div>
                    <div class="d-flex align-center">
                        <v-btn
                            size="small"
                            icon="mdi-plus"
                            variant="text"
                            @click="createDialog = true"
                            class="show-on-hover"
                        />
                        <v-btn
                            size="small"
                            icon="mdi-dots-horizontal"
                            variant="text"
                            class="show-on-hover"
                        />
                        <v-btn
                            size="small"
                            icon="mdi-delete"
                            variant="text"
                            @click="confirmDialog = true"
                            class="show-on-hover"
                        />
                        <v-badge
                            v-if="subtaskCount > 0"
                            :content="subtaskCount"
                            inline
                            class="hide-on-hover"
                        ></v-badge>
                    </div>
                </div>
            </div>
        </v-sheet>
        <v-sheet rounded>
            <display-tasks :display-tasks="showTasks" :tasks="task.subtasks" />
        </v-sheet>
    </div>
</template>

<script setup lang="ts">
import type { Task } from '@/model';
import { computed, ref } from 'vue';
import DisplayTasks from './DisplayTasks.vue';

const showTasks = ref(true);
const createDialog = ref(false);
const confirmDialog = ref(false);
const props = defineProps<{
    task: Task;
    isDraggable?: boolean;
}>();
const taskRef = ref<Task>(props.task);
const subtaskCount = computed(() => taskRef.value.subtasks.length);

function toggleTask() {
    taskRef.value.complete = !taskRef.value.complete;
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
