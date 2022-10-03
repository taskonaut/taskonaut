<template>
    <div>
        <v-list-item
            :lines="countLines()"
            :rounded="true"
            :title="task.header"
            :value="task!.uuid"
            :active="false"
            :class="task.complete && 'complete'"
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
                        class="hidden-opacity handle"
                        :class="!task.complete && 'shown-opacity'"
                        :end="true"
                        icon="mdi-dots-vertical"
                    />
                    <v-checkbox-btn
                        @change="toggleTask(task!.uuid)"
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
                    @click="showDialog = true"
                    class="show-on-hover"
                />
                <v-btn
                    size="small"
                    icon="mdi-delete"
                    variant="text"
                    @click="deleteTask(task!.uuid)"
                    class="show-on-hover"
                />
            </template>
            <TaskDialog v-if="showDialog" :task="task" v-model="showDialog" />
        </v-list-item>
    </div>
</template>

<script setup lang="ts">
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import DateChip from '@/components/shared/DateChip.vue';
import type { Task } from '@/model';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { ref } from 'vue';

const showDialog = ref(false);

const props = defineProps<{
    task: Task;
}>();

const appStore = useAppStore();
const task = computed(() => appStore.getTaskById(props.task.uuid));

function countLines(): 'one' | 'two' | 'three' {
    const numberNames = ['one', 'two', 'three'];
    let count = 0;
    if (props.task.dueDate) count++;
    if (props.task.body) count++;

    return numberNames[count] as 'one' | 'two' | 'three';
}

function toggleTask(taskId: string) {
    appStore.toggleTask(taskId);
}

function deleteTask(taskId: string) {
    appStore.deleteTask(taskId);
}
</script>

<style scoped>
.v-list-item {
    border-bottom: 1px #333333 solid;
    border-radius: 0;
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
