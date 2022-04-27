import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView'),
        },
    ],
});

// router.beforeEach((to, from) => {
//
//     if (!to.meta.public && !session.getters.isAuthenticated) {
//         return { name: 'login' };
//     }
//
//     return true;
// });

export default router;