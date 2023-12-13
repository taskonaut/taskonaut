<template>
    <div>
        <v-dialog
            :max-width="!mobile ? '600' : '100vw'"
            v-model="isOpen"
            :scrollable="false"
            :scrim="true"
            :fullscreen="mobile"
            transition="dialog-top-transition"
        >
            <v-card :height="mobile ? '100vh' : 'auto'">
                <v-toolbar dark color="primary" density="compact">
                    <v-btn icon dark @click="isOpen = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title> {{ title }} </v-toolbar-title>
                </v-toolbar>
                <v-card-text>{{ message }} </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-2 mb-2" color="warning" @click="confirm">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import useConfirmDialog from '@/composables/confirmDialog';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const { closeConfirmDialog, isOpen, title, message, callback } =
    useConfirmDialog();

function confirm() {
    callback.value();
    closeConfirmDialog();
}
</script>
<style scoped>
button {
    text-transform: uppercase;
}
</style>
