import GroupView from '@/views/GroupView.vue';
import InboxView from '@/views/InboxView.vue';
import TodayView from '@/views/TodayView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'inbox',
            component: InboxView,
        },
        {
            path: '/today',
            name: 'today',
            component: TodayView,
        },
        {
            path: '/group/:id',
            name: 'group',
            component: GroupView,
        },
    ],
});

export default router;
