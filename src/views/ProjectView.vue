<template>
    <h2 id="msg" v-if="!tasks.length">This is Empty :(</h2>
    <v-list v-if="tasks.length" select-strategy="leaf"
        ><v-list-subheader>ONGOING</v-list-subheader
        ><v-list-item
            v-for="task in ongoingTasks"
            :key="task.uuid"
            :title="task.header"
            :subtitle="task.body"
            :value="task.uuid"
            :active="task.complete"
        >
            <template v-slot:prepend>
                <v-list-item-action start>
                    <v-checkbox-btn
                        @change="toggleTask(task.uuid)"
                        :model-value="task.complete"
                    ></v-checkbox-btn>
                </v-list-item-action>
            </template>
            <template v-slot:append>
                <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
            </template>
        </v-list-item>
    </v-list>
    <v-list v-if="tasks.length" select-strategy="leaf">
        <v-list-subheader>COMPLETE</v-list-subheader>
        <v-list-item
            v-for="task in completeTasks"
            :key="task.uuid"
            :title="task.header"
            :subtitle="task.body"
            :value="task.uuid"
            :active="task.complete"
        >
            <template v-slot:prepend>
                <v-list-item-action start>
                    <v-checkbox-btn
                        @change="toggleTask(task.uuid)"
                        :model-value="task.complete"
                    ></v-checkbox-btn>
                </v-list-item-action>
            </template>
            <template v-slot:append>
                <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
            </template>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const store = useAppStore();
const tasks = computed(() => store.getGroupTasks(useRoute().params.id[0]));

const ongoingTasks = computed(() =>
    tasks.value.filter((task) => !task.complete)
);
const completeTasks = computed(() =>
    tasks.value.filter((task) => task.complete)
);

function toggleTask(taskId: string) {
    store.toggleTask(taskId);
}
</script>

<style scoped>
#msg {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
