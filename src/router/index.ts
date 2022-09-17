import { useUserStore } from '@/stores/userStore';
import ProjectView from '@/views/ProjectView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const requireAuth = async (to, from, next) => {
    await useUserStore().currentUser();
    next();
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/project/:id',
            name: 'project',
            component: ProjectView,
            beforeEnter: requireAuth,
        },
    ],
});

export default router;
