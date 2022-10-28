<template>
    <v-dialog
        :max-width="!mobile ? '600' : '100vw'"
        @update:model-value="emits('update:modelValue', $event)"
        :model-value="props.modelValue"
        :scrim="true"
        :fullscreen="mobile"
        transition="dialog-bottom-transition"
    >
        <v-form ref="form" v-model="formData.valid" :submit="formSubmit">
            <v-card :height="mobile ? '100vh' : 'auto'">
                <v-toolbar dark color="primary" density="compact">
                    <v-btn icon dark @click="closeDialog()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="!props.group">
                        Add Group
                    </v-toolbar-title>
                    <v-toolbar-title v-if="props.group">
                        Edit Group
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                            :disabled="!formData.valid"
                            type="submit"
                            text
                            dark
                            v-if="!props.group"
                            >Add</v-btn
                        >
                        <v-btn text dark type="submit" v-if="props.group"
                            >Save</v-btn
                        >
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-text-field
                        autofocus
                        type="search"
                        density="compact"
                        variant="outlined"
                        v-model="formData.name"
                        label="Group Name"
                        :rules="formData.rules"
                        required
                        ref="nameInput"
                        @keyup.enter.prevent="
                            if (!formData.name && !formData.description)
                                closeDialog();
                            else formSubmit();
                        "
                    ></v-text-field>
                    <v-textarea
                        auto-grow
                        density="compact"
                        variant="outlined"
                        label="Description (optional)"
                        v-model="formData.description"
                        rows="3"
                        @keydown="textareaHandler($event)"
                    ></v-textarea>
                    <v-text-field
                        v-if="isLoggedIn"
                        autofocus
                        density="compact"
                        variant="outlined"
                        v-model="formData.sharedWith"
                        label="Share by email (optional)"
                        required
                        ref="sharedWithInput"
                        @keydown.enter="formSubmit()"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions v-if="props.group">
                    <v-btn color="warning" @click="deleteConfirmDialog = true"
                        >Delete</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-btn color="accent" @click="resetGroup">Reset</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
    <ConfirmDialog
        v-model="deleteConfirmDialog"
        :title="'Delete Group?'"
        :message="`Are you sure you want to delete ${props.group?.name}? All related tasks will be lost!`"
        @dialog:confirm="deleteGroup"
    />
</template>

<script setup lang="ts">
import type { Group } from '@/model';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import { computed, reactive, ref } from 'vue';
import { useDisplay } from 'vuetify';
import ConfirmDialog from './ConfirmDialog.vue';

const props = defineProps<{
    group?: Group;
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const deleteConfirmDialog = ref(false);

const { mobile } = useDisplay();

const appStore = useAppStore();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

const form = ref();
const nameInput = ref();
const sharedWithInput = ref();
const formData = reactive({
    valid: false,
    rules: [(v: any) => !!v || 'Name is required'],
    name: props.group?.name || '',
    description: props.group?.description || '',
    sharedWith: props.group?.sharedWith.join(',') || '',
});

function textareaHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
        formData.description += '\n';
    } else if (!event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (formData.name) formSubmit();
    }
}

function closeDialog() {
    emits('update:modelValue', false);
}

function formSubmit() {
    if (props.group) {
        appStore.updateGroup(
            props.group.uuid,
            formData.name,
            formData.description,
            formData.sharedWith
        );
    } else {
        appStore.createGroup(
            formData.name,
            formData.description,
            formData.sharedWith
        );
        form.value.reset();
    }
    closeDialog();
}

function deleteGroup() {
    appStore.deleteGroup(props.group?.uuid as string);
    router.push({ name: 'inbox' });
    closeDialog();
}

function resetGroup() {
    appStore.resetGroup(props.group?.uuid as string);
    closeDialog();
}
</script>
<style scoped>
button {
    text-transform: uppercase;
}
</style>
