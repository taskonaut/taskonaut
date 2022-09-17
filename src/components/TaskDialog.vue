<template>
    <v-dialog
        :model-value="props.open"
        activator="parent"
        fullscreen
        :scrim="false"
        transition="dialog-bottom-transition"
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="emitClose()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark text @click="emitClose()"> Save </v-btn>
                </v-toolbar-items>
            </v-toolbar>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

function emitClose() {
    emit('close');
}
</script>
<style scoped></style>
