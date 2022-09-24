<template>
    <v-dialog
        :max-width="!mobile ? '600' : '100vw'"
        v-model="showDialog"
        :scrim="false"
        :fullscreen="mobile"
        transition="dialog-bottom-transition"
        @keydown.esc="emits('closeDialog')"
    >
        <v-form ref="form" v-model="formData.valid" :submit="formSubmit">
            <v-card :height="mobile ? '100vh' : 'auto'">
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="closeDialog()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="!props.task">
                        Add New Task
                    </v-toolbar-title>
                    <v-toolbar-title v-if="props.task">
                        Edit Task
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-text-field
                        autofocus
                        v-model="formData.name"
                        label="Task Name"
                        :rules="formData.rules"
                        required
                        ref="nameInput"
                        @keydown.enter="
                            if (!formData.name && !formData.body)
                                emits('closeDialog');
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
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
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
                    <v-btn
                        color="warning"
                        @click="deleteTask"
                        v-if="props.task?.uuid"
                        >Delete</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Task } from '@/model';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { reactive, ref, computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    task?: Task;
    showDialog: boolean;
}>();

const emits = defineEmits<{
    (e: 'closeDialog', state: void): void;
}>();

const { mobile } = useDisplay();

const appStore = useAppStore();

const form = ref();
const nameInput = ref();
const selectedGroup =
    router.currentRoute.value.name === 'group'
        ? (router.currentRoute?.value?.params?.id as string)
        : '';
const formData = reactive({
    valid: false,
    rules: [(v: any) => !!v || 'Name is required'],
    name: props.task?.header || '',
    body: props.task?.body || '',
    groupId: props.task?.groupId || selectedGroup,
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
        emits('closeDialog');
    } else {
        appStore.createTask(formData.name, formData.body, formData.groupId);
        form.value.reset();
        nameInput.value.focus();
    }
}

function closeDialog() {
    emits('closeDialog');
    if (!props.task) form.value.reset();
}
function textareaHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
        formData.body += '\n';
    } else if (!event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (formData.name) formSubmit();
    }
}

function deleteTask() {
    appStore.deleteTask(props.task?.uuid as string);
}

function destroy() {
    console.log('destroyed');
}
</script>
<style scoped>
button {
    text-transform: uppercase;
}
</style>
