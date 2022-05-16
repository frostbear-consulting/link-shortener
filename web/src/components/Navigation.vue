<template>

    <header class='navbar'>
        <section class='navbar-section'>
            <router-link class='btn btn-primary' :to='{name: "createLink"}'>Create link</router-link>
        </section>
        <section class='navbar-section'>
            <button type='button' @click='onLogoutClick' class='btn btn-link'>Logout</button>
        </section>
    </header>

</template>

<script>
import { DELETE } from '@/http-client';
import { session } from '@/stores/session.store';

export default {
    name: 'Navigation',

    methods: {
        async onLogoutClick() {
            await DELETE('api/session');
            session.commit('signOut');

            this.$router.push({ name: 'login' });
        },
    },
};
</script>

<style scoped>
header {
    background: #ffc;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    margin: 1rem 0;
    padding: 0.25rem 0.5rem;
}
</style>