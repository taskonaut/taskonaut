<template>
    <v-list-item
        v-if="groupSnap"
        :title="props.group.name"
        :value="props.group.name"
        :active="props.group.uuid == router.currentRoute.value.params.id"
        @click="switchGroupRoute(props.group.uuid)"
    >
        <template v-slot:prepend>
            <v-icon class="group-drag" icon="mdi-drag" />
        </template>
        <template v-slot:append>
            <v-btn
                icon="mdi-dots-horizontal"
                variant="text"
                @click="showDialog = true"
                class="show-on-hover"
                size="extra-small"
            />
            <TaskCounter :count="groupSnap.tasks.length" />
        </template>
        <GroupDialog
            v-if="showDialog"
            :group="props.group"
            v-model="showDialog"
        />
    </v-list-item>
</template>

<script setup lang="ts">
import GroupDialog from '@/components/dialogs/GroupDialog.vue';
import router from '@/router';
import { onBeforeUnmount, ref } from 'vue';
import TaskCounter from './TaskCounter.vue';
import { onGroup } from '@/services/firebase.service';

const props = defineProps<{
    group: any;
}>();

const { group: groupSnap, unsubscribe } = onGroup(props.group.uuid);
const showDialog = ref(false);

function switchGroupRoute(listId: string) {
    router.push({ name: 'group', params: { id: listId } });
}

onBeforeUnmount(() => {
    unsubscribe();
});
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
