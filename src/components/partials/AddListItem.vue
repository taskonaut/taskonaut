<template>
    <v-list-item title="Add New Task" value="add" :active="false">
        <template v-slot:prepend>
            <v-list-item-action start>
                <v-btn variant="tonal" icon="mdi-plus" size="small"></v-btn>
            </v-list-item-action>
        </template>
    </v-list-item>
    <TaskDialog />
</template>

<script setup lang="ts">
import TaskDialog from '../TaskDialog.vue';
</script>

<style scoped></style>
