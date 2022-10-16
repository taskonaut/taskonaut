<template>
    <v-list
        v-if="groups?.length > 0"
        density="compact"
        nav
        select-strategy="single-leaf"
    >
        <v-row class="justify-space-between align-center my-1 mx-1">
            <v-list-subheader
                class="d-flex align-content-center subtitle"
                title="Shared projects"
            />
        </v-row>
        <GroupItem
            v-for="element in groups"
            :key="element.uuid"
            :group="element"
        ></GroupItem>
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

const groups = computed(() => store.getSharedGroups);
</script>

<style scoped>
.subtitle {
    text-transform: uppercase;
}
</style>
