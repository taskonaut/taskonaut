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
                        @keydown.enter="
                            if (!formData.header && !formData.body)
                                closeDialog();
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
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="!props.task"
                    :disabled="!isFormValid"
                    @click="form.submit()"
                    >Add</v-btn
                >
                <v-btn v-else :disabled="!isFormValid" @click="form.submit()"
                    >Save</v-btn
                >
                <v-btn color="warning" @click="confirmDialog = true">
                    Delete
                </v-btn>
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
const headerInput = ref();
const selectedGroup =
    router.currentRoute.value.name === 'group'
        ? (router.currentRoute?.value?.params?.id as string)
        : undefined;
const dueDate = props.task
    ? props.task?.dueDate || undefined
    : router.currentRoute.value.name === 'today'
    ? new Date().getTime()
    : undefined;

const formRules = [(v: any) => !!v || 'Name is required'];
const isFormValid = ref(false);
const formData = reactive({
    header: props.task?.header || '',
    body: props.task?.body || '',
    groupId: (props.task?.groupId || selectedGroup) as any,
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
        appStore.createTask(formData);
        form.value.reset();
        formData.groupId = selectedGroup || undefined;
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
