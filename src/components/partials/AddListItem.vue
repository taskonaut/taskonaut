<template>
    <v-list-item
        title="Add New Task"
        value="add"
        :active="false"
        @click="dialogState = true"
    >
        <template v-slot:prepend>
            <v-list-item-action start>
                <v-btn
                    variant="tonal"
                    icon="mdi-plus"
                    size="small"
                    @click="dialogState = true"
                >
                </v-btn>
            </v-list-item-action>
            <TaskDialog
                :open="dialogState"
                @close="dialogState = false"
            ></TaskDialog>
        </template>
    </v-list-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TaskDialog from '../TaskDialog.vue';

const dialogState = ref(false);
</script>

<style scoped></style>
