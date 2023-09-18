<template>
    <v-dialog
        :max-width="!mobile ? '600' : '100vw'"
        @update:model-value="emits('update:modelValue', $event)"
        :model-value="props.modelValue"
        :scrim="true"
        :fullscreen="mobile"
        transition="dialog-bottom-transition"
    >
        <v-card :height="mobile ? '100vh' : 'auto'">
            <v-toolbar dark color="primary" density="compact">
                <v-btn icon dark @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title v-if="!props.task"> Add Task </v-toolbar-title>
                <v-toolbar-title v-if="props.task"> Edit Task </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form
                    ref="form"
                    v-model="isFormValid"
                    :submit="formSubmit"
                    autocomplete="off"
                >
                    <v-text-field
                        type="search"
                        :autofocus="props.task ? false : true"
                        density="compact"
                        variant="outlined"
                        v-model="formData.header"
                        label="Task Name"
                        :rules="formRules"
                        required
                        ref="headerInput"
                        @keyup.enter.prevent="
                            if (!formData.header && !formData.body)
                                closeDialog();
                            else formSubmit();
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
                        v-if="!props.parentId"
                        density="compact"
                        variant="outlined"
                        :clearable="true"
                        no-data-text="No groups available :("
                        v-model="formData.parentId"
                        :items="taskGroups"
                        item-title="name"
                        item-value="uuid"
                        label="Select group (optional)"
                        persistent-hint
                        single-line
                    ></v-select>
                    <Datepicker
                        v-if="!props.parentId"
                        v-model="formData.dueDate"
                        modelType="timestamp"
                        :enableTimePicker="false"
                        showNowButton
                        nowButtonLabel="Today"
                        placeholder="Due Date"
                        :dark="useTheme().global.current.value.dark"
                        autoApply
                    />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="warning"
                    @click="confirmDialog = true"
                    v-if="props.task"
                >
                    Delete
                </v-btn>
                <v-spacer />
                <v-btn
                    v-if="!props.task"
                    data-cy="add-task-button"
                    :disabled="!isFormValid"
                    @click="form.submit()"
                    >Add</v-btn
                >
                <v-btn
                    v-else
                    data-cy="save-task-button"
                    :disabled="!isFormValid"
                    @click="form.submit()"
                    >Save</v-btn
                >
            </v-card-actions>
        </v-card>
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
import { reactive, ref, computed, onMounted } from 'vue';
import { useDisplay, useTheme } from 'vuetify';
import ConfirmDialog from './ConfirmDialog.vue';
import * as date from '@/services/date.service';

const props = defineProps<{
    task?: Task;
    parentId?: string;
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const { mobile } = useDisplay();
const appStore = useAppStore();

const confirmDialog = ref(false);
const form = ref();
const headerInput = ref();
const selectedGroup =
    router.currentRoute.value.name === 'group'
        ? (router.currentRoute?.value?.params?.id as string)
        : undefined;
const dueDate = props.task
    ? props.task.dueDate
        ? date.resetTime(props.task.dueDate)
        : undefined
    : router.currentRoute.value.name === 'today'
    ? date.getToday()
    : undefined;

const formRules = [(v: any) => !!v || 'Name is required'];
const isFormValid = ref(false);
const formData = reactive({
    header: props.task?.header || '',
    body: props.task?.body || '',
    parentId: (props.parentId || selectedGroup) as any,
    dueDate,
});

const taskGroups = computed(() => appStore.getGroups);

onMounted(() => {
    if (props.task) form.value.validate();
});

function formSubmit() {
    if (props.task) {
        appStore.updateTask({ uuid: props.task.uuid, ...formData });
        closeDialog();
    } else {
        appStore.addTask({ ...formData });

        form.value.reset();
        formData.parentId = selectedGroup || undefined;
        headerInput.value.focus();
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
        if (formData.header) formSubmit();
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
