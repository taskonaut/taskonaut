import { useUserStore } from '@/stores/userStore';
import GroupView from '@/views/GroupView.vue';
import InboxView from '@/views/InboxView.vue';
import TodayView from '@/views/TodayView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const requireAuth = async (to, from, next) => {
    await useUserStore().currentUser();
    next();
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'inbox',
            component: InboxView,
            beforeEnter: requireAuth,
        },
        {
            path: '/today',
            name: 'today',
            component: TodayView,
            beforeEnter: requireAuth,
        },
        {
            path: '/group/:id',
            name: 'group',
            component: GroupView,
            beforeEnter: requireAuth,
        },
    ],
});

export default router;
