<template>
    <v-dialog
        v-model="dialogOpen"
        activator="parent"
        :scrim="false"
        transition="dialog-bottom-transition"
    >
        <v-card min-width="600">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title v-if="!props.task">
                    Add New Task
                </v-toolbar-title>
                <v-toolbar-title v-if="props.task"> Edit Task </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-form
                    ref="form"
                    v-model="formData.valid"
                    :submit="formSubmit"
                >
                    <v-text-field
                        autofocus
                        v-model="formData.name"
                        label="Task Name"
                        :rules="formData.rules"
                        required
                        ref="nameInput"
                        @keydown.enter="
                            if (!formData.name && !formData.body)
                                dialogOpen = false;
                        "
                    ></v-text-field>
                    <v-textarea
                        auto-grow
                        label="Description (optional)"
                        v-model="formData.body"
                        rows="1"
                        @keydown="textareaHandler($event)"
                    ></v-textarea>
                    <v-select
                        v-model="formData.groupId"
                        :items="taskGroups"
                        item-title="name"
                        item-value="uuid"
                        label="Select"
                        persistent-hint
                        single-line
                    ></v-select>
                    <v-btn
                        :disabled="!formData.valid"
                        color="success"
                        type="submit"
                        v-if="!props.task"
                        >Add</v-btn
                    >
                    <v-btn color="success" type="submit" v-if="props.task"
                        >Save</v-btn
                    >
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Task } from '@/model';
import { useAppStore } from '@/stores/appStore';
import { reactive, ref, computed } from 'vue';

const props = defineProps<{
    task?: Task;
}>();

const appStore = useAppStore();

const dialogOpen = ref(false);
const form = ref();
const nameInput = ref();
const formData = reactive({
    valid: false,
    rules: [(v: any) => !!v || 'Name is required'],
    name: props.task?.header || '',
    body: props.task?.body || '',
    groupId: props.task?.groupId || '',
});

const taskGroups = computed(() => appStore.getGroups);

function formSubmit() {
    if (props.task) {
        appStore.updateTask(
            props.task.uuid,
            formData.name,
            formData.body,
            formData.groupId
        );
        dialogOpen.value = false;
    } else {
        appStore.createTask(formData.name, formData.body, formData.groupId);
        form.value.reset();
        nameInput.value.focus();
    }
}

function closeDialog() {
    dialogOpen.value = false;
    if (!props.task) form.value.reset();
}
function textareaHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
        formData.body += '\n';
    } else if (!event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        formSubmit();
    }
}
</script>
<style scoped></style>
