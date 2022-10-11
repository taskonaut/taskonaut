<template>
    <v-dialog
        :max-width="!mobile ? '600' : '100vw'"
        @update:model-value="emits('update:modelValue', $event)"
        :model-value="props.modelValue"
        :scrim="true"
        :fullscreen="mobile"
        transition="dialog-bottom-transition"
    >
        <v-form
            ref="form"
            v-model="formData.valid"
            :submit="formSubmit"
            autocomplete="off"
        >
            <v-card :height="mobile ? '100vh' : 'auto'">
                <v-toolbar dark color="primary" density="compact">
                    <v-btn icon dark @click="closeDialog()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="!props.task">
                        Add Task
                    </v-toolbar-title>
                    <v-toolbar-title v-if="props.task">
                        Edit Task
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                            :disabled="!formData.valid"
                            type="submit"
                            v-if="!props.task"
                            text
                            dark
                            >Add</v-btn
                        >
                        <v-btn type="submit" v-if="props.task" text dark
                            >Save</v-btn
                        >
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-text-field
                        autofocus
                        density="compact"
                        variant="outlined"
                        v-model="formData.name"
                        label="Task Name"
                        :rules="formData.rules"
                        required
                        ref="nameInput"
                        @keydown.enter="
                            if (!formData.name && !formData.body) closeDialog();
                        "
                    ></v-text-field>

                    <v-textarea
                        density="compact"
                        variant="outlined"
                        auto-grow
                        label="Description (optional)"
                        v-model="formData.body"
                        rows="3"
                        @keydown="textareaHandler($event)"
                    ></v-textarea>
                    <v-select
                        density="compact"
                        variant="outlined"
                        :clearable="true"
                        no-data-text="No groups available :("
                        v-model="formData.groupId"
                        :items="taskGroups"
                        item-title="name"
                        item-value="uuid"
                        label="Select group (optional)"
                        persistent-hint
                        single-line
                    ></v-select>
                    <Datepicker
                        v-model="formData.dueDate"
                        modelType="timestamp"
                        :enableTimePicker="false"
                        showNowButton
                        nowButtonLabel="Today"
                        placeholder="Due Date"
                        dark
                        autoApply
                    />
                </v-card-text>
                <v-card-actions v-if="props.task?.uuid">
                    <v-spacer></v-spacer>
                    <v-btn
                        class="mr-2 mb-2"
                        color="warning"
                        @click="confirmDialog = true"
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
    <ConfirmDialog
        v-model="confirmDialog"
        :title="'Delete Task?'"
        :message="'Are you sure you want to delete this task?'"
        @dialog:confirm="deleteTask()"
    />
</template>

<script setup lang="ts">
import type { Task } from '@/model';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { reactive, ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import ConfirmDialog from './ConfirmDialog.vue';

const props = defineProps<{
    task?: Task;
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const { mobile } = useDisplay();
const appStore = useAppStore();

const confirmDialog = ref(false);
const form = ref();
const nameInput = ref();
const selectedGroup =
    router.currentRoute.value.name === 'group'
        ? (router.currentRoute?.value?.params?.id as string)
        : undefined;
const formData = reactive({
    valid: false,
    rules: [(v: any) => !!v || 'Name is required'],
    name: props.task?.header || '',
    body: props.task?.body || '',
    groupId: (props.task?.groupId || selectedGroup) as any,
    dueDate: props.task?.dueDate || undefined,
});

const taskGroups = computed(() => appStore.getGroups);

function formSubmit() {
    if (props.task) {
        appStore.updateTask(
            props.task.uuid,
            formData.name,
            formData.body,
            formData.groupId,
            formData.dueDate
        );
        closeDialog();
    } else {
        appStore.createTask(
            formData.name,
            formData.body,
            formData.groupId,
            formData.dueDate
        );
        form.value.reset();
        formData.groupId = selectedGroup || undefined;
        nameInput.value.focus();
    }
}

function closeDialog() {
    emits('update:modelValue', false);
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
</script>
<style scoped>
button {
    text-transform: uppercase;
}
</style>
