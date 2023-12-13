import type { Task } from '@/model';
import { reactive } from 'vue';

interface TaskDialogState {
    isOpen: boolean;
    task: null | Task;
}

const state: TaskDialogState = reactive({
    isOpen: false,
    task: null,
});

export default function useTaskDialog() {
    const open = () => (state.isOpen = true);
    const close = () => {
        state.isOpen = false;
        state.task = null;
    };
    return { state, open, close };
}
