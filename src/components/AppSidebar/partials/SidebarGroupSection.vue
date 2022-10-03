<template>
    <v-list density="compact" nav select-strategy="single-leaf">
        <v-row class="justify-space-between align-center my-1 mx-1">
            <v-list-subheader
                class="d-flex align-content-center"
                title="PROJECTS"
            />
            <v-btn
                :rounded="true"
                size="x-small"
                icon="mdi-plus"
                variant="flat"
                @click="openDialog = true"
            />
        </v-row>
        <draggable item-key="uuid" v-model="groups">
            <template #item="{ element }">
                <GroupItem :key="element.uuid" :group="element"></GroupItem>
            </template>
        </draggable>
    </v-list>
    <GroupDialog v-model="openDialog"></GroupDialog>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import GroupDialog from '@/components/dialogs/GroupDialog.vue';
import GroupItem from './partials/GroupItem.vue';
import { useAppStore } from '@/stores/appStore';
import { ref, computed } from 'vue';

const store = useAppStore();
const openDialog = ref(false);

const groups = computed({
    get: () =>
        store.groupOrder.map((id) =>
            store.groups.find((group) => group.uuid == id)
        ),
    set: (groups) => store.setGroupOrder(groups.map((group) => group!.uuid)),
});
</script>

<style scoped></style>
