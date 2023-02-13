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
                    <DateChip
                        v-if="task.dueDate || task.dateCompleted"
                        :task="task"
                        class="mt-1"
                    />
                    <GroupChip
                        v-if="
                            !props.subtask &&
                            task.parentId &&
                            router.currentRoute.value.params.id !==
                                task.parentId
                        "
                        :groupId="task.parentId"
                        class="mt-1"
                    />
                </div>
            </v-list-item-subtitle>
            <template v-slot:prepend>
                <v-list-item-action>
                    <v-icon
                        v-if="props.isDraggable"
                        class="handle mr-2"
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
                :parent-id="task.uuid"
                v-model="createDialog"
            />
            <TaskDialog v-if="editDialog" :task="task" v-model="editDialog" />
            <ConfirmDialog
                v-if="confirmDialog"
                v-model="confirmDialog"
                :title="'Delete Task?'"
                :message="'Are you sure you want to delete this task?'"
                @dialog:confirm="deleteTask(task!.uuid)"
            />
        </v-list-item>
        <div class="px-2 py-2" v-if="subTasks && subTasks.length">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-title class="subtasks-title"
                        ><v-icon size="x-small">mdi-file-tree</v-icon>
                        {{ subTasks.length }} subtasks
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <draggable
                            @change="handleChange"
                            :component-data="{ parentUuid: props.task.uuid }"
                            item-key="uuid"
                            v-model="subTasks"
                            handle=".handle"
                            group="items"
                        >
                            <template #item="{ index, element }">
                                <div>
                                    <TaskItem
                                        :task="element!"
                                        :isDraggable="true"
                                        :subtask="true"
                                    />

                                    <v-divider
                                        v-if="index < subTasks.length - 1"
                                        :key="`${index}-divider`"
                                    />
                                </div>
                            </template>
                        </draggable>
                        <!-- <display-tasks
                            :tasks="subTasks"
                            :subtasks="true"
                            :group-id="props.task.uuid"
                        /> -->
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </div>
</template>

<script setup lang="ts">
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import DateChip from '@/components/shared/DateChip.vue';
import type { Task } from '@/model';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { onMounted, ref, watch } from 'vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';
import GroupChip from './GroupChip.vue';
import { computed } from 'vue';
import { sortArray } from '@/services/utils.service';
import draggable from 'vuedraggable';
// import DisplayTasks from '@/components/shared/DisplayTasks.vue';

const createDialog = ref(false);
const editDialog = ref(false);
const confirmDialog = ref(false);

const appStore = useAppStore();

const props = defineProps<{
    task: Task;
    subtask?: boolean;
    isDraggable?: boolean;
}>();
const order = ref<string[]>([]);
const tasks = computed(() => appStore.getGroupTasks(props.task.uuid));

const subTasks = computed({
    get() {
        return sortArray(tasks.value, order.value);
    },
    set(newTasks) {
        order.value = newTasks!.map((item) => item.uuid);
    },
});

onMounted(() => {
    order.value = props.task.taskOrder;
});

function countLines(): 'one' | 'two' | 'three' {
    const numberNames = ['one', 'two', 'three'];
    let count = 0;
    if (props.task && props.task.dueDate) count++;
    if (props.task && props.task.body) count++;

    return numberNames[count] as 'one' | 'two' | 'three';
}
function toggleTask() {
    appStore.updateTask({
        uuid: props.task.uuid,
        complete: !props.task.complete,
    });
}

function deleteTask(taskId: string) {
    appStore.deleteTask(taskId);
}

watch(order, (newVal) => {
    appStore.updateTask({
        uuid: props.task.uuid,
        taskOrder: newVal,
    });
});

function handleChange(e: any) {
    if (e.added) {
        appStore.updateTask({
            uuid: e.added.element.uuid,
            parentId: props.task.uuid,
        });
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
