<template>
    <div>
        <v-list-item
            class="py-3"
            title="Add New Task"
            value="add"
            :active="false"
            @click="showDialog = true"
        >
            <template v-slot:prepend>
                <v-list-item-action>
                    <div style="width: 32px" id="spacer"></div>
                    <v-btn variant="plain" icon="mdi-plus" size="small" />
                </v-list-item-action>
            </template>
        </v-list-item>
        <div v-if="showDialog">
            <TaskDialog v-model="showDialog" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TaskDialog from '@/components/dialogs/TaskDialog.vue';

const showDialog = ref(false);
</script>

<style scoped></style>
