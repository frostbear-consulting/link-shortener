<template>
    <form @submit.prevent.stop='formSubmitted'>
        <h1>Register new account</h1>

        <div class='form-group'>
            <label for='login--username' class='form-label'>Username</label>
            <input type='text' required class='form-input' id='login--username' v-model='name' />
        </div>

        <div class='form-group'>
            <label for='login--firstName' class='form-label'>First name</label>
            <input type='text' required class='form-input' id='login--firstName' v-model='firstName' />
        </div>

        <div class='form-group'>
            <label for='login--lastName' class='form-label'>Last name</label>
            <input type='text' required class='form-input' id='login--lastName' v-model='lastName' />
        </div>

        <div class='form-group'>
            <label for='login--email' class='form-label'>Email address</label>
            <input type='email' required class='form-input' id='login--email' v-model='email' />
        </div>

        <div class='form-group'>
            <label for='login--password' class='form-label'>Password</label>
            <input type='password' required class='form-input' id='login--password' v-model='password' />
        </div>

        <div class='text-right button-container'>
            <button type='submit' class='btn btn-primary'>Register</button>
        </div>

        <router-link to='/login'>Login</router-link>

    </form>
</template>

<script>
import { useTitle } from '@/lib';
import { POST } from '@/http-client';
import { session } from '@/stores/session.store';

export default {
    name: 'RegisterView',

    data() {
        return {
            name: 'peter',
            firstName: 'Dr. med',
            lastName: 'Wurst',
            email: 'peter@lustig.de',
            password: 'password',
        };
    },

    methods: {
        async formSubmitted() {
            const body = {
                name: this.name,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
            };

            const response = await POST('api/register', body);

            session.commit(
                'signIn',
                response.body.idUser,
                response.body.firstName,
                response.body.lastName,
                response.body.name,
                response.body.email,
            );

            this.$router.push({ name: 'dashboard' });
        },
    },

    mounted() {
        useTitle('Register');
    },
};
</script>

<style scoped>
form {
    max-width: 400px;
    margin: 3rem auto;
    background: rgba(255, 255, 255, 0.75);
    border: #ccc 1px solid;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.75);
    padding: 1rem;
    border-radius: 5px;
}

.button-container {
    margin-top: 2rem;
}
</style>

<style>
body, html {
    height: 100%;
    padding: 0;
    margin: 0;
}

body {
    background: url('https://images.unsplash.com/photo-1646435854908-26c027dc7aed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80') center center no-repeat;
    background-size: cover;
}
</style>