<template>
    <v-list-item
        prependIcon="mdi-circle-medium"
        :title="props.group.name"
        :value="props.group.name"
        :active="props.group.uuid == router.currentRoute.value.params.id"
        @click="switchGroupRoute(props.group.uuid)"
    >
        <template v-slot:append>
            <v-btn
                icon="mdi-dots-horizontal"
                variant="text"
                @click="showDialog = true"
                class="show-on-hover"
                size="extra-small"
            />
            <TaskCounter :count="taskCount" />
        </template>
        <GroupDialog
            v-if="showDialog"
            :group="props.group"
            v-model="showDialog"
        />
    </v-list-item>
</template>

<script setup lang="ts">
import type { Group } from '@/model';
import GroupDialog from '@/components/dialogs/GroupDialog.vue';
import router from '@/router';
import { computed, ref } from 'vue';
import { useAppStore } from '@/stores/appStore';
import TaskCounter from './TaskCounter.vue';

const props = defineProps<{
    group: Group;
}>();

const showDialog = ref(false);
const taskCount = computed(
    () =>
        useAppStore()
            .getGroupTasks(props.group.uuid)
            .filter((task) => !task.complete).length
);

function switchGroupRoute(listId: string) {
    router.push({ name: 'group', params: { id: listId } });
}
</script>

<style scoped>
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
</style>
