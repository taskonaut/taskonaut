<template>
    <v-list select-strategy="leaf" bg-color="background">
        <v-list-subheader v-if="props.subheader">
            {{ props.subheader }}
        </v-list-subheader>
        <draggable
            item-key="uuid"
            :model-value="taskList"
            @change="updateTaskOrder"
            handle=".handle"
            v-if="tasks && tasks.length > 0"
        >
            <template #item="{ index, element }">
                <div>
                    <TaskItem
                        :task="element!"
                        :isDraggable="taskOrder && true"
                    /><v-divider
                        v-if="index < tasks.length - 1"
                        :key="`${index}-divider`"
                    />
                </div>
            </template>
        </draggable>
        <slot></slot>
    </v-list>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import type { Task } from '@/model';
import TaskItem from './TaskItem.vue';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';

const props = defineProps<{
    subheader?: string;
    tasks: Task[];
    groupId?: string;
}>();

const taskList = computed(() => {
    return props.groupId != undefined
        ? taskOrder.value?.map((id) => useAppStore().getTaskById(id))
        : props.tasks;
});

const taskOrder = computed(() =>
    props.groupId ? useAppStore().getTaskOrderById(props.groupId) : undefined
);

function updateTaskOrder(e: any) {
    const newTaskOrder = moveItemInArray(
        taskOrder.value!,
        e.moved.oldIndex,
        e.moved.newIndex
    );
    useAppStore().setTaskOrder(props.groupId as string, newTaskOrder);
}

function moveItemInArray(
    arr: Array<any>,
    oldIndex: number,
    newIndex: number
): Array<any> {
    const array = [...arr];
    const element = array.splice(oldIndex, 1)[0];
    array.splice(newIndex, 0, element);
    return array;
}
</script>

<style scoped></style>
