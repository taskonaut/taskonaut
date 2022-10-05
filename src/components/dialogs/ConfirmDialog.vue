<template>
    <v-dialog
        :max-width="!mobile ? '600' : '100vw'"
        @update:model-value="emits('update:modelValue', $event)"
        :model-value="props.modelValue"
        :scrim="true"
        :fullscreen="mobile"
        transition="dialog-bottom-transition"
    >
        <v-card :height="mobile ? '100vh' : 'auto'">
            <v-toolbar dark color="primary" density="compact">
                <v-btn icon dark @click="cancel()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title> {{ props.title }} </v-toolbar-title>
            </v-toolbar>
            <v-card-text>{{ props.message }} </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-2 mb-2" color="warning" @click="confirm">
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const props = defineProps<{
    modelValue: boolean;
    message: string;
    title: string;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
    (e: 'dialog:confirm'): void;
}>();

const { mobile } = useDisplay();

function cancel() {
    emits('update:modelValue', false);
}

function confirm() {
    emits('dialog:confirm');
    emits('update:modelValue', false);
}
</script>
<style scoped>
button {
    text-transform: uppercase;
}
</style>
