<template>
    <v-list
        select-strategy="leaf"
        bg-color="background"
        v-if="tasks && tasks.length > 0"
    >
        <v-list-subheader title="ONGOING" />
        <draggable item-key="uuid" v-model="tasks" handle=".handle">
            <template #item="{ element }">
                <TaskItem :task="element!" :isDraggable="true" />
            </template>
        </draggable>
        <AddListItem />
        <div v-if="doneTasks && doneTasks.length > 0">
            <v-divider />
            <v-list-subheader v-if="doneTasks.length" title="COMPLETE" />
            <div class="completed">
                <TaskItem
                    v-for="task in doneTasks"
                    :key="task?.uuid"
                    :task="task"
                />
            </div>
        </div>
    </v-list>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TaskItem from '@/components/shared/TaskItem.vue';
import AddListItem from '@/components/shared/AddListItem.vue';

const store = useAppStore();
const groupId = computed(() => useRoute().params.id as string);

const taskOrder = computed(() => store.getGroupOrder(groupId.value));

const tasks = computed({
    get: () => {
        return taskOrder?.value
            ?.map((id) => store.getTaskById(id))
            .filter((a) => a);
    },
    set: (tasks) => {
        return store.setTaskOrder(
            groupId.value,
            tasks.map((task) => task!.uuid)
        );
    },
});

const doneTasks = computed(() =>
    store.getGroupTasks(groupId.value).filter((task) => task && task?.complete)
);
</script>

<style scoped>
/* .sortable-chosen {
    background-color: greenyellow !important;
}
.sortable-ghost {
    opacity: 100 !important;
    background-color: rebeccapurple !important;
}
.sortable-drag {
    background-color: red !important;
} */
</style>
