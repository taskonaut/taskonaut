<template>
  <v-card>
    <v-layout>
      <Sidebar />
      <v-main style="height: 100vh">      
        <Main />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
  import Main from '../components/Main.vue';
  import Sidebar from '../components/Sidebar.vue';
</script>
