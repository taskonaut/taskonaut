<template>
    <div class="navigation-drawer">
        <div class="button-container">
            <v-btn
                icon
                variant="text"
                @click="switchRoute('inbox')"
                :color="
                    router.currentRoute.value.name === 'inbox'
                        ? 'primary'
                        : 'none'
                "
                ><v-icon>mdi-inbox-arrow-down</v-icon></v-btn
            >
            <v-btn
                icon
                variant="text"
                @click="switchRoute('today')"
                :color="
                    router.currentRoute.value.name === 'today'
                        ? 'primary'
                        : 'none'
                "
                ><v-icon>mdi-calendar-clock</v-icon></v-btn
            >
            <v-btn icon color="primary" @click="$emit('showAddDialog')"
                ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
                icon
                variant="text"
                @click="switchRoute('upcoming')"
                :color="
                    router.currentRoute.value.name === 'upcoming'
                        ? 'primary'
                        : 'none'
                "
                ><v-icon>mdi-view-week</v-icon></v-btn
            >
            <v-btn
                icon
                variant="text"
                @click="switchRoute('expired')"
                :color="
                    router.currentRoute.value.name === 'expired'
                        ? 'primary'
                        : 'none'
                "
                ><v-icon>mdi-clock</v-icon></v-btn
            >
        </div>
    </div>
</template>
<script setup lang="ts">
import router from './router';

function switchRoute(routeName: string) {
    if (router.hasRoute(routeName)) router.push({ name: routeName });
}
</script>
<style scoped>
.navigation-drawer {
    position: fixed;
    display: flex;
    align-items: flex-end;
    direction: ltr;
    bottom: 0;
    width: 100%;
    z-index: 1;
    height: 64px;
    background: #212121;
    box-shadow: 0px 2px 4px 2px
            var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
        0px 4px 5px 0px
            var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
        0px 1px 10px 0px
            var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}

.button-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    flex-basis: 100%;
    transition: all 0.3s;
}

.btn {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
