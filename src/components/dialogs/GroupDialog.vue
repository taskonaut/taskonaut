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
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="closeDialog()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="!props.group">
                        Add New Group
                    </v-toolbar-title>
                    <v-toolbar-title v-if="props.group">
                        Edit Group
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-text-field
                        autofocus
                        v-model="formData.name"
                        label="Group Name"
                        :rules="formData.rules"
                        required
                        ref="nameInput"
                        @keydown.enter="closeDialog()"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        :disabled="!formData.valid"
                        color="success"
                        type="submit"
                        v-if="!props.group"
                        >Add</v-btn
                    >
                    <v-btn color="success" type="submit" v-if="props.group"
                        >Save</v-btn
                    >
                    <v-btn
                        color="warning"
                        @click="deleteGroup"
                        v-if="props.group"
                        >Delete</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Group } from '@/model';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { reactive, ref } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    group?: Group;
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', state: boolean): void;
}>();

const { mobile } = useDisplay();

const appStore = useAppStore();

const form = ref();
const nameInput = ref();
const formData = reactive({
    valid: false,
    rules: [(v: any) => !!v || 'Name is required'],
    name: props.group?.name || '',
});

function closeDialog() {
    emits('update:modelValue', false);
}

function formSubmit() {
    if (props.group) {
        appStore.updateGroup(props.group.uuid, formData.name);
    } else {
        appStore.createGroup(formData.name);
        form.value.reset();
    }
    closeDialog();
}

function deleteGroup() {
    appStore.deleteGroup(props.group?.uuid as string);
    router.push({ name: 'inbox' });
    closeDialog();
}
</script>
<style scoped>
button {
    text-transform: uppercase;
}
</style>