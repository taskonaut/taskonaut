<template>
    <v-navigation-drawer
        permanent
      >
        <template v-slot:prepend>
          <v-list-item
            twoLine
            prependAvatar="https://randomuser.me/api/portraits/women/81.jpg"
            title="Jane Smith"
            subtitle="Logged in"
          ></v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item v-for="item in items" :prependIcon="item.icon" :title="item.title" :value="item.value"></v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<script setup lang="ts">
    const items = [
        { title: 'Inbox', icon: 'mdi-home-city', value: 'inbox' },
        { title: 'Today', icon: 'mdi-account', value: 'today' },
        { title: 'Upcoming', icon: 'mdi-account-group-outline', value: 'upcoming' },
        { title: 'Calendar', icon: 'mdi-calendar', value: 'calendar' },
    ];
</script>