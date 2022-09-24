<template>
    <v-container>
        <v-list-item title="Add New Task" value="add" :active="false">
            <template v-slot:prepend>
                <v-list-item-action>
                    <v-icon variant="tonal" icon="mdi-plus" size="small" />
                </v-list-item-action>
            </template>
        </v-list-item>
        <TaskDialog />
    </v-container>
</template>

<script setup lang="ts">
import TaskDialog from '../TaskDialog.vue';
</script>

<style scoped></style>
