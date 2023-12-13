<template>
    <v-list
        density="compact"
        nav
        select-strategy="single-leaf"
        v-if="groupList"
    >
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
        <draggable
            @update="handleUpdate"
            item-key="uuid"
            :animation="150"
            v-model="groupList"
            handle=".group-drag"
        >
            <template #item="{ element }">
                <group-item :key="element.uuid" :group="element"></group-item>
            </template>
        </draggable>
    </v-list>
    <group-dialog v-model="openDialog"></group-dialog>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import GroupDialog from '@/components/dialogs/GroupDialog.vue';
import GroupItem from './partials/GroupItem.vue';
import { ref } from 'vue';
import { updateGroupList } from '@/services/firebase.service';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const openDialog = ref(false);
const { groupList } = storeToRefs(useUserStore());

async function handleUpdate() {
    await updateGroupList(groupList.value);
}
</script>
