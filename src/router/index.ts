import { useUserStore } from '@/stores/userStore';
import ExpiredView from '@/views/ExpiredView.vue';
import GroupView from '@/views/GroupView.vue';
import InboxView from '@/views/InboxView.vue';
import TodayView from '@/views/TodayView.vue';
import UpcomingView from '@/views/UpcomingView.vue';
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
            path: '/upcoming',
            name: 'upcoming',
            component: UpcomingView,
        },
        {
            path: '/expired',
            name: 'expired',
            component: ExpiredView,
        },
        {
            path: '/group/:id',
            name: 'group',
            component: GroupView,
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    await useUserStore().currentUser();
    next();
});

export default router;
