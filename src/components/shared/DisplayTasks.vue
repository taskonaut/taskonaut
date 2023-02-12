<template>
    <!-- Ongoing Tasks -->
    <v-list select-strategy="leaf" bg-color="background">
        <v-list-subheader> Ongoing </v-list-subheader>
        <draggable item-key="uuid" v-model="ongoingTasks" handle=".handle">
            <template #item="{ index, element }">
                <div>
                    <TaskItem :task="element!" :isDraggable="props.draggable" />

                    <v-divider
                        v-if="index < ongoingTasks.length - 1"
                        :key="`${index}-divider`"
                    />
                </div>
            </template>
        </draggable>
        <AddListItem v-if="!props.hideAddButton && !smAndDown" />
        <!-- Divider -->
        <v-divider v-if="completeTasks.length && !smAndDown" />
        <!-- Completed Tasks -->
        <v-list-subheader v-if="completeTasks.length">
            Complete
        </v-list-subheader>
        <draggable item-key="uuid" v-model="completeTasks" handle=".handle">
            <template #item="{ index, element }">
                <div>
                    <TaskItem :task="element!" :isDraggable="false" />

                    <v-divider
                        v-if="index < completeTasks.length - 1"
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
import { computed, ref, onMounted, watch } from 'vue';
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

const order = ref<string[]>([]);

onMounted(() => {
    if (props.groupId) order.value = useAppStore().getGroupOrder(props.groupId);
});
const ongoingTasks = computed({
    get() {
        return sortArray(
            props.tasks.filter((task) => !task.complete),
            order.value!
        );
    },
    set(tasks) {
        order.value = tasks.map((task) => task.uuid);
    },
});

watch(order, (newVal) => {
    useAppStore().updateGroup({
        uuid: props.groupId,
        taskOrder: newVal,
    });
});

const completeTasks = computed(() =>
    props.tasks.filter((task) => task.complete)
);
</script>
<style scoped></style>
