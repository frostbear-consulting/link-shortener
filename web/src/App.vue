<script>
import 'spectre.css';
import { session } from '@/stores/session.store';
import { GET } from '@/http-client';

export default {
    name: 'App',

    data() {
        return { loaded: false };
    },

    async mounted() {
        try {
            const response = await GET('api/session');

            session.commit(
                'signIn',
                response.body.idUser,
                response.body.firstName,
                response.body.lastName,
                response.body.name,
                response.body.email,
            );

        } catch (ignore) {

        } finally {
            this.loaded = true;
        }
    },
};
</script>

<template>
    <div class='container grid-lg'>
        <router-view v-if='loaded' />
    </div>
</template>