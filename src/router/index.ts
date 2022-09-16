import ProjectView from '@/views/ProjectView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/project/:id',
            name: 'project',
            component: ProjectView,
        },
    ],
});

export default router;
