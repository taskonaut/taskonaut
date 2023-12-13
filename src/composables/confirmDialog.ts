import { reactive, toRefs } from 'vue';

interface ConfirmDialogStateData {
    title: string;
    message: string;
    callback: Function;
}

interface ConfirmDialogState extends ConfirmDialogStateData {
    isOpen: boolean;
}

const state: ConfirmDialogState = reactive({
    isOpen: false,
    title: '',
    message: '',
    callback: () => {},
});

export default function useConfirmDialog() {
    const openConfirmDialog = (data: ConfirmDialogStateData) => {
        state.title = data.title;
        state.message = data.message;
        state.callback = data.callback;
        state.isOpen = true;
    };
    const closeConfirmDialog = () => {
        state.isOpen = false;
        state.title = '';
        state.message = '';
        state.callback = () => {};
    };

    return { openConfirmDialog, closeConfirmDialog, ...toRefs(state) };
}
