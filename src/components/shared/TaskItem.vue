<template>
    <div>
        <v-list-item
            v-if="task"
            :lines="countLines()"
            :rounded="true"
            :title="task?.header"
            :value="task?.uuid"
            :active="false"
            :class="task.complete && 'complete'"
            @dblclick="editDialog = true"
        >
            <v-list-item-subtitle>
                <div v-if="task.body">{{ task.body }}</div>
                <div class="metadata">
                    <DateChip v-if="task.dueDate" :task="task" class="mt-1" />
                    <GroupChip
                        v-if="
                            task.groupId &&
                            router.currentRoute.value.params.id !== task.groupId
                        "
                        :groupId="task.groupId"
                        class="mt-1"
                    />
                </div>
            </v-list-item-subtitle>
            <template v-slot:prepend>
                <v-list-item-action>
                    <v-icon
                        v-if="props.isDraggable"
                        class="handle"
                        :class="{
                            'shown-opacity': !task.complete,
                            'hidden-opacity': !mobile,
                        }"
                        :end="true"
                        icon="mdi-drag"
                    />
                    <v-checkbox-btn
                        @change="toggleTask()"
                        :model-value="task!.complete"
                        true-icon="mdi-checkbox-marked-circle-outline"
                        false-icon="mdi-checkbox-blank-circle-outline"
                    ></v-checkbox-btn>
                </v-list-item-action>
            </template>
            <template v-slot:append>
                <v-btn
                    v-if="!props.parentTaskId"
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
                    @click="editDialog = true"
                    class="show-on-hover"
                />
                <v-btn
                    size="small"
                    icon="mdi-delete"
                    variant="text"
                    @click="confirmDialog = true"
                    class="show-on-hover"
                />
            </template>
            <TaskDialog
                v-if="createDialog"
                :taskId="task.uuid"
                v-model="createDialog"
            />
            <TaskDialog
                v-if="editDialog"
                :taskId="parentTaskId"
                :task="task"
                v-model="editDialog"
            />
            <ConfirmDialog
                v-if="confirmDialog"
                v-model="confirmDialog"
                :title="'Delete Task?'"
                :message="'Are you sure you want to delete this task?'"
                @dialog:confirm="deleteTask(task!.uuid)"
            />
        </v-list-item>

        <v-expansion-panels v-if="task.subTasks && task.subTasks.length > 0">
            <v-expansion-panel>
                <v-expansion-panel-title class="subtasks-title"
                    ><v-icon size="x-small">mdi-file-tree</v-icon>
                    {{ task.subTasks.length }} subtasks
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <TaskItem
                        v-for="subTask in task.subTasks"
                        :key="subTask.uuid"
                        :task="subTask"
                        :parentTaskId="task.uuid"
                    />
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script setup lang="ts">
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import DateChip from '@/components/shared/DateChip.vue';
import type { Task } from '@/model';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { ref } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';
import GroupChip from './GroupChip.vue';

const createDialog = ref(false);
const editDialog = ref(false);
const confirmDialog = ref(false);

const props = defineProps<{
    task: Task;
    isDraggable?: boolean;
    parentTaskId?: string;
}>();

const appStore = useAppStore();
const mobile = useDisplay().xs;

function countLines(): 'one' | 'two' | 'three' {
    const numberNames = ['one', 'two', 'three'];
    let count = 0;
    if (props.task && props.task.dueDate) count++;
    if (props.task && props.task.body) count++;

    return numberNames[count] as 'one' | 'two' | 'three';
}

function toggleTask() {
    // TODO: merge updateTask and updateSubtask together
    if (props.parentTaskId) {
        appStore.updateSubTask(
            { ...props.task, complete: !props.task?.complete },
            props.parentTaskId
        );
    } else {
        appStore.updateTask({ ...props.task, complete: !props.task?.complete });
    }
}

function deleteTask(taskId: string) {
    // TODO: merge updateTask and updateSubtask together
    if (props.parentTaskId) {
        appStore.deleteSubTask(taskId, props.parentTaskId);
    } else {
        appStore.deleteTask(taskId);
    }
}
</script>

<style scoped>
.v-list-item {
    padding-bottom: 10px;
}
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

.complete {
    opacity: 40%;
}

.metadata {
    display: flex;
    gap: 5px;
}

.v-expansion-panel {
    border-radius: 0;
}

.subtasks-title {
    gap: 10px;
    font-size: 0.9em;
    color: #999;
}
</style>
