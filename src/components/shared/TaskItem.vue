<template>
    <div v-if="task">
        <v-list-item
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
                <DateChip
                    v-if="task.dueDate"
                    :date="task!.dueDate"
                    class="mt-1"
                />
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
                    <div v-else style="width: 32px" id="spacer"></div>
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
            <TaskDialog v-if="editDialog" :task="task" v-model="editDialog" />
            <ConfirmDialog
                v-if="confirmDialog"
                v-model="confirmDialog"
                :title="'Delete Task?'"
                :message="'Are you sure you want to delete this task?'"
                @dialog:confirm="deleteTask(task!.uuid)"
            />
        </v-list-item>
        <v-divider></v-divider>
    </div>
</template>

<script setup lang="ts">
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';
import DateChip from '@/components/shared/DateChip.vue';
import type { Task } from '@/model';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { ref } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const editDialog = ref(false);
const confirmDialog = ref(false);

const props = defineProps<{
    task: Task;
    isDraggable?: boolean;
}>();

const appStore = useAppStore();
const task = computed(() => appStore.getTaskById(props?.task?.uuid));

const mobile = useDisplay().xs;

function countLines(): 'one' | 'two' | 'three' {
    const numberNames = ['one', 'two', 'three'];
    let count = 0;
    if (props.task && props.task.dueDate) count++;
    if (props.task && props.task.body) count++;

    return numberNames[count] as 'one' | 'two' | 'three';
}

function toggleTask() {
    appStore.updateTask({ ...task.value, complete: !task?.value?.complete });
}

function deleteTask(taskId: string) {
    appStore.deleteTask(taskId);
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
</style>
