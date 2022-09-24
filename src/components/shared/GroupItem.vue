<template>
    <v-list-item
        prependIcon="mdi-circle-medium"
        :title="props.group.name"
        :value="props.group.name"
        :active="props.group.uuid == router.currentRoute.value.params.id"
        @click="switchGroupRoute(props.group.uuid)"
    >
        <template v-slot:append>
            <v-btn
                icon="mdi-dots-horizontal"
                variant="text"
                @click="showDialog = true"
                class="show-on-hover"
                size="extra-small"
            />
        </template>
    </v-list-item>
    <GroupDialog :group="props.group" v-model="showDialog" />
</template>

<script setup lang="ts">
import type { Group } from '@/model';
import GroupDialog from '../GroupDialog.vue';
import router from '@/router';
import { ref } from 'vue';

const props = defineProps<{
    group: Group;
}>();

const showDialog = ref(false);
function switchGroupRoute(listId: string) {
    router.push({ name: 'group', params: { id: listId } });
}
</script>

<style scoped>
.show-on-hover {
    opacity: 0;
}

.v-list-item:hover .show-on-hover {
    opacity: 100;
}
</style>
