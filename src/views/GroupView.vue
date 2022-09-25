<template>
    <v-card rounded="lg">
        <v-list select-strategy="leaf">
            <v-list-subheader title="ONGOING" />
            <draggable item-key="uuid" v-model="tasks">
                <template #item="{ element }">
                    <div v-if="!element.complete">
                        <TaskItem :taskId="element.uuid" />
                    </div>
                </template>
            </draggable>
            <v-divider v-if="doneTasks.length" />
            <v-list-subheader v-if="doneTasks.length" title="COMPLETE" />
            <TaskItem
                v-for="task in doneTasks"
                :key="task!.uuid"
                :task-id="task!.uuid"
            />
        </v-list>
    </v-card>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TaskItem from '@/components/shared/TaskItem.vue';

const store = useAppStore();
const groupId = computed(() => useRoute().params.id as string);

const taskOrder = computed(() => store.getGroupOrder(groupId.value));

const tasks = computed({
    get: () => taskOrder.value.map((id) => store.getTaskById(id)),
    set: (tasks) =>
        store.setGroupOrder(
            groupId.value,
            tasks.map((task) => task!.uuid)
        ),
});

const doneTasks = computed(() => tasks.value.filter((task) => task?.complete));
</script>

<style scoped></style>
