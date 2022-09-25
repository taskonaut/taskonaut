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
        <GroupItem v-for="group in groups" :key="group.uuid" :group="group" />
    </v-list>
    <GroupDialog v-model="openDialog"></GroupDialog>
</template>

<script setup lang="ts">
import GroupDialog from '@/components/dialogs/GroupDialog.vue';
import GroupItem from './partials/GroupItem.vue';
import { useAppStore } from '@/stores/appStore';
import { ref, computed } from 'vue';

const store = useAppStore();
const openDialog = ref(false);
const groups = computed(() => store.getGroups);
</script>

<style scoped></style>
