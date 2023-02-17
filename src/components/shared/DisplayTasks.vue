<template>
    <!-- Ongoing Tasks -->
    <v-list select-strategy="leaf" bg-color="background">
        <v-list-subheader v-if="!subtasks && localTasks.length">
            Ongoing
        </v-list-subheader>
        <draggable
            item-key="uuid"
            v-model="localTasks"
            handle=".handle"
            group="items"
            @change="handleChange"
        >
            <template #item="{ index, element }">
                <div>
                    <TaskItem
                        v-if="!element.complete"
                        :task="element"
                        :isDraggable="props.draggable"
                        :subtask="props.subtasks"
                    />

                    <v-divider
                        v-if="index < localTasks.length - 1"
                        :key="`${index}-divider`"
                    />
                </div>
            </template>
        </draggable>
        <AddListItem v-if="!props.hideAddButton && !smAndDown" />
        <!-- Divider -->
        <v-divider v-if="localTasks.length && !smAndDown" />
        <!-- Completed Tasks -->
        <v-list-subheader v-if="localTasks.length"> Complete </v-list-subheader>
        <draggable
            item-key="uuid"
            v-model="localTasks"
            handle=".handle"
            group="items"
        >
            <template #item="{ index, element }">
                <div>
                    <TaskItem
                        v-if="element.complete"
                        :task="element!"
                        :isDraggable="false"
                        :subtask="props.subtasks"
                    />

                    <v-divider
                        v-if="index < localTasks.length - 1"
                        :key="`${index}-divider`"
                    />
                </div>
            </template>
        </draggable>
    </v-list>
</template>
<script setup lang="ts">
import draggable from 'vuedraggable';
import type { Task } from '@/model';
import { ref, watch } from 'vue';
import TaskItem from './TaskItem.vue';
import AddListItem from './AddListItem.vue';
import { useDisplay } from 'vuetify';
import { useAppStore } from '@/stores/appStore';
import { sortArray } from '@/services/utils.service';

const { smAndDown } = useDisplay();

const props = defineProps({
    tasks: {
        required: true,
        type: Array<Task>,
    },
    subtasks: { type: Boolean, default: false },
    groupId: { type: String },
    draggable: {
        type: Boolean,
        default: true,
    },
    hideAddButton: {
        type: Boolean,
        default: false,
    },
});

const localTasks = ref<Task[]>(
    sortArray(props.tasks, useAppStore().getTaskOrder(props.groupId!))
);

// const ongoingTasks = computed({
//     get() {
//         return sortArray(
//             props.tasks.filter((task) => !task.complete),
//             order.value!
//         );
//     },
//     set(tasks) {
//         order.value = tasks.map((task) => task.uuid);
//     },
// });

// const completeTasks = computed(() =>
//     props.tasks.filter((task) => task.complete)
// );

function handleChange(e: any) {
    if (e.added) {
        e.added.element.parentId = props.groupId;
        useAppStore().updateTask({
            uuid: e.added.element.uuid,
            parentId: props.groupId,
        });
    }
    if (props.groupId && !props.subtasks) {
        useAppStore().updateGroup({
            uuid: props.groupId,
            taskOrder: localTasks.value.map((task) => task.uuid),
        });
    } else if (props.subtasks) {
        useAppStore().updateTask({
            uuid: props.groupId,
            taskOrder: localTasks.value.map((task) => task.uuid),
        });
    }
}

watch(
    () => props.tasks,
    () =>
        (localTasks.value = sortArray(
            props.tasks,
            useAppStore().getTaskOrder(props.groupId!)
        ))
);
</script>
<style scoped></style>
