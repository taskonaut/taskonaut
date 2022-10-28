<template>
    <v-snackbar
        :model-value="offlineReady || needRefresh"
        :close-on-content-click="true"
        :timeout="-1"
        z-index="2400"
        location="bottom"
    >
        <span v-if="offlineReady"> App ready to work offline </span>
        <span v-else>
            New content available, click on reload button to update.
        </span>
        <template v-slot:actions>
            <v-btn
                v-if="needRefresh"
                color="pink"
                variant="text"
                @click="updateServiceWorker()"
                >Relaod
            </v-btn>
            <v-btn color="pink" variant="text" @click="close">Close</v-btn>
        </template>
    </v-snackbar>
</template>
<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl) {
        // eslint-disable-next-line no-console
        console.log(`Service Worker at: ${swUrl}`);
    },
});

const close = async () => {
    offlineReady.value = false;
    needRefresh.value = false;
};
</script>
<style>
.position {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    z-index: 2400;
}
.pwa-toast .message {
    margin-bottom: 8px;
}
.pwa-toast button {
    border: 1px solid #8885;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
}
</style>
