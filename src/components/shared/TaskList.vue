<template>
    <div
        v-if="props.modelValue!.length < 1 && props.isTopLevel"
        class="d-flex h-100 justify-center align-center text-h4"
    >
        List is empty...
    </div>
    <draggable
        v-else
        item-key="uuid"
        handle=".handle"
        :animation="150"
        :swapThreshold="10"
        easing="cubic-bezier(1, 0, 0, 1)"
        :model-value="props.modelValue"
        @update:modelValue="(tasks) => emit('update:modelValue', tasks)"
        :group="{ name: 'tasks' }"
    >
        <template #item="{ element }">
            <div>
                <task-item :task="element" :is-draggable="true"> </task-item>
            </div>
        </template>
    </draggable>
</template>
<script setup lang="ts">
import draggable from 'vuedraggable';
import TaskItem from './TaskItem.vue';
import type { Task } from '@/model';

const props = defineProps({
    modelValue: {
        type: Array<Task>,
    },
    isTopLevel: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits<{
    'update:modelValue': [any[]];
}>();
</script>
