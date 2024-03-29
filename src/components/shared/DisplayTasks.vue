<template>
    <!-- Ongoing Tasks -->
    <v-list select-strategy="leaf" bg-color="background">
        <v-list-subheader
            v-if="localTasks.filter((task) => !task.complete).length"
        >
            Ongoing
        </v-list-subheader>
        <draggable
            item-key="uuid"
            v-model="localTasks"
            handle=".handle"
            group="items"
            @change="handleChange"
            class="hide-last-hr"
        >
            <template #item="{ element }">
                <div v-if="!element.complete">
                    <TaskItem
                        :task="element"
                        :isDraggable="props.draggable"
                        :subtask="props.subtasks"
                    />
                    <v-divider class="last" />
                </div>
            </template>
        </draggable>
        <AddListItem v-if="!props.hideAddButton && !smAndDown" />
        <div
            v-if="
                localTasks.filter((task) => task.complete).length && !smAndDown
            "
        >
            <!-- Divider -->
            <v-divider />
            <!-- Completed Tasks -->
            <v-list-subheader v-if="localTasks.length">
                Complete
            </v-list-subheader>
        </div>

        <draggable
            item-key="uuid"
            v-model="localTasks"
            handle=".handle"
            class="hide-last-hr"
        >
            <template #item="{ element }">
                <div v-if="element.complete">
                    <TaskItem
                        :task="element!"
                        :isDraggable="false"
                        :subtask="props.subtasks"
                    />
                    <v-divider />
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
    metaId: { type: String },
    draggable: {
        type: Boolean,
        default: true,
    },
    hideAddButton: {
        type: Boolean,
        default: false,
    },
});
const localOrder = ref<string[]>(
    useAppStore().getMeta(props.metaId!)
        ? useAppStore().getMeta(props.metaId!).order
        : []
);
const localTasks = ref<Task[]>(sortArray(props.tasks, localOrder.value));

//TODO: refactor, looks more complicated than it should
function handleChange(e: any) {
    localOrder.value = localTasks.value.map((task) => task.uuid);
    if (e.added) {
        if (props.metaId == 'inbox' || props.metaId == 'today') {
            e.added.element.parendId = '';
            console.log(e.added.element.parendId);
            useAppStore().updateTask({
                uuid: e.added.element.uuid,
                parentId: '',
            });
        } else {
            e.added.element.parentId = props.metaId;
            useAppStore().updateTask({
                uuid: e.added.element.uuid,
                parentId: props.metaId,
            });
        }
    }
    if (props.metaId) {
        useAppStore().setMeta(props.metaId, { order: localOrder.value });
    }
}

watch(
    () => props.tasks,
    () => (localTasks.value = sortArray(props.tasks, localOrder.value))
);
</script>
<style scoped>
.hide-last-hr > :last-child > hr {
    display: none;
}
</style>
