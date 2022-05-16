import { createRouter, createWebHistory } from 'vue-router';
import { session } from '@/stores/session.store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView'),
            meta: { public: true },
        },

        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView'),
            meta: { public: true },
        },

        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/DashboardView'),
        },

        {
            path: '/create',
            name: 'createLink',
            component: () => import('@/views/CreateLinkView'),
        },

        {
            path: '/r/:token',
            name: 'redirect',
            component: () => import('@/views/RedirectView'),
            meta: { public: true },
        },
    ],
});

router.beforeEach((to, from) => {

    if (!to.meta.public && !session.getters.isAuthenticated) {
        return { name: 'login' };
    }

    return true;
});

export default router;