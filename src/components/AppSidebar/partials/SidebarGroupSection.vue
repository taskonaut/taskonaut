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
        <draggable item-key="uuid" v-model="groups" handle=".group-drag">
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
import { ref, onMounted, watch, computed } from 'vue';
import type { Group } from '@/model';

const store = useAppStore();
const openDialog = ref(false);
const order = ref<string[]>([]);

onMounted(() => {
    if (store.user) order.value = store.user.order;
});

const groups = computed({
    get() {
        return sortArray(store.groups, order.value || []);
    },
    set(groups) {
        order.value = groups!.map((item) => item.uuid);
    },
});

watch(order, (newVal) => {
    store.setGroupOrder(newVal!.map((item) => item));
});

function sortArray(array: Group[], sortArray: string[]): Group[] {
    return [...array].sort(
        (a, b) => sortArray.indexOf(a.uuid) - sortArray.indexOf(b.uuid)
    );
}
</script>

<style scoped></style>
