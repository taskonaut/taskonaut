<template>
    <v-list-item title="Add New Task" value="add" :active="false">
        <template v-slot:prepend>
            <v-list-item-action start>
                <v-btn variant="tonal" icon="mdi-plus" size="small"></v-btn>
            </v-list-item-action>
        </template>
    </v-list-item>
</template>

<script setup lang="ts"></script>

<style scoped></style>
