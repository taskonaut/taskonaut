<template>
    <v-dialog
        :max-width="!mobile ? '600' : '100vw'"
        :scrollable="false"
        v-model="taskDialog.isOpen"
        :scrim="true"
        :fullscreen="mobile"
        transition="dialog-bottom-transition"
    >
        <v-card>
            <!-- Header -->
            <v-toolbar dark color="primary" density="compact">
                <v-btn icon dark @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title v-if="!taskDialog.task">
                    Add Task
                </v-toolbar-title>
                <v-toolbar-title v-else> Edit Task </v-toolbar-title>
            </v-toolbar>
            <!-- Body -->
            <v-card-text>
                <!-- Form -->
                <v-form
                    ref="form"
                    v-model="formModel.isValid"
                    autocomplete="off"
                >
                    <!-- Name -->
                    <v-text-field
                        type="search"
                        density="compact"
                        variant="outlined"
                        v-model="formModel.name"
                        label="Task Name"
                        :rules="formRules"
                        required
                        ref="nameInput"
                    />
                    <!-- Description -->
                    <v-textarea
                        density="compact"
                        variant="outlined"
                        auto-grow
                        label="Description (optional)"
                        v-model="formModel.description"
                        rows="3"
                    ></v-textarea>
                    <!-- Group -->
                    <v-select
                        v-if="!taskDialog.task"
                        density="compact"
                        variant="outlined"
                        :clearable="true"
                        no-data-text="No groups available :("
                        v-model="formModel.group.selected"
                        :items="formModel.group.list"
                        item-title="name"
                        item-value="uuid"
                        label="Select group (optional)"
                        persistent-hint
                        single-line
                    />
                    <!-- Date -->
                    <v-text-field
                        v-model="formModel.dueDate"
                        type="date"
                        variant="outlined"
                        density="compact"
                    />
                </v-form>
            </v-card-text>
            <!-- Footer -->
            <v-card-actions>
                <v-btn
                    text="Delete"
                    color="warning"
                    @click="confirmDelete"
                    v-if="taskDialog.task"
                />
                <v-spacer />
                <v-btn
                    text="Add"
                    v-if="!taskDialog.task"
                    :disabled="!formModel.isValid"
                    @click="sumbitForm"
                />
                <v-btn
                    text="Save"
                    v-else
                    :disabled="!formModel.isValid"
                    @click="sumbitForm"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import router from '@/router';
import { createTask } from '@/services/data.service';
import {
    deleteTask,
    getGroup,
    getInbox,
    updateGroup,
    updateInbox,
    updateTask,
} from '@/services/firebase.service';
import { getLocalDate, getTimestamp } from '@/services/date.service';
import type { Task } from '@/model';
import useConfirmDialog from '@/composables/confirmDialog';
import useTaskDialog from '@/composables/taskDialog';

const { state: taskDialog } = useTaskDialog();

onMounted(() => {
    if (taskDialog.task) form.value.validate();
});

const { groupList } = storeToRefs(useUserStore());
const { mobile } = useDisplay();

const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

const form = ref();
const nameInput = ref();

const formRules = [(v: any) => !!v || 'Name is required'];

function setformModelGroup() {
    return router.currentRoute.value.name === 'group'
        ? (router.currentRoute.value.params.id as string)
        : null;
}

const formModel = reactive({
    isValid: false,
    name: '',
    description: '',
    group: {
        selected: setformModelGroup(),
        list: computed(() => groupList.value),
    },
    dueDate: '',
});

async function sumbitForm() {
    const { name, description, dueDate, group } = formModel;
    if (!taskDialog.task) {
        // Add new Task
        const task = await createTask({
            name,
            description,
            dueDate: dueDate ? getTimestamp(dueDate) : null,
            groupId: group.selected,
        });

        if (task.groupId) {
            // Add new task to group
            const group = await getGroup(task.groupId);
            group.tasks.push(task);
            await updateGroup(group);
        } else {
            // Add to inbox
            const inbox = await getInbox();
            inbox.push(task);
            await updateInbox(inbox);
        }
    } else {
        // Update existing task
        const updatedTask: Task = {
            ...taskDialog.task,
            name,
            description,
            dueDate: dueDate ? getTimestamp(dueDate) : null,
            groupId: group.selected,
        };
        await updateTask(updatedTask);
    }
    closeDialog();
}

function closeDialog() {
    taskDialog.isOpen = false;
    taskDialog.task = null;
    form.value.reset();
}

async function confirmDelete() {
    const confirmDeleteDialog = {
        message: 'Are you sure you want to delete this task?',
        title: 'Delete task?',
        callback: async () => {
            deleteTask(taskDialog.task!);
            closeConfirmDialog();
            closeDialog();
        },
    };
    openConfirmDialog(confirmDeleteDialog);
}

watch(
    () => taskDialog.isOpen,
    (isOpen) => {
        if (isOpen) {
            formModel.group.selected = setformModelGroup();
            if (taskDialog.task) {
                const { name, description, dueDate } = taskDialog.task;
                formModel.name = name;
                formModel.description = description || '';
                formModel.dueDate = dueDate ? getLocalDate(dueDate) : '';
            }
        }
    }
);
// TODO: make a better one

// function textareaHandler(event: KeyboardEvent) {
//     if (event.ctrlKey && event.key === 'Enter') {
//         formModel.description += '\n';
//     } else if (!event.ctrlKey && event.key === 'Enter') {
//         event.preventDefault();
//         if (formModel.name) {
//             handleSubmit();
//         }
//     }
// }
</script>
<style scoped>
button {
    text-transform: uppercase;
}
</style>
