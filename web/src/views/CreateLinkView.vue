<template>
    <div>
        <Navigation />

        <form @submit.prevent.stop='formSubmitted'>

            <div class='form-group'>
                <label for='createLink--originalLink' class='form-label'>Link:</label>
                <input type='url'
                       required
                       maxlength='2048'
                       class='form-input'
                       id='createLink--originalLink'
                       v-model='originalLink' />
            </div>

            <div class='form-group'>
                <label for='createLink--token' class='form-label'>Short link:</label>
                <input type='text'
                       required
                       maxlength='20'
                       class='form-input'
                       id='createLink--token'
                       v-model='token' />
            </div>

            <button type='submit' class='btn btn-primary'>Submit</button>
            <router-link :to='{name: "dashboard"}' class='btn btn-link'>Cancel</router-link>
        </form>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation';
import { POST } from '@/http-client';

export default {
    name: 'CreateLinkView',
    components: {
        Navigation,
    },

    data() {
        const token = btoa(Date.now() + '').replaceAll('=', '');

        return {
            originalLink: '',
            token,
        };
    },

    methods: {
        async formSubmitted() {
            const payload = {
                originalLink: this.originalLink,
                token: this.token,
            };

            await POST('api/links', payload);

            this.$router.push({ name: 'dashboard' });
        },
    },
};
</script>