<template>
    <form @submit.prevent.stop='formSubmitted'>
        <h1>Login</h1>

        <div class='form-group'>
            <label for='login--username' class='form-label'>Username</label>
            <input type='text' required class='form-input' id='login--username' v-model='user' />
        </div>

        <div class='form-group'>
            <label for='login--password' class='form-label'>Password</label>
            <input type='password' required class='form-input' id='login--password' v-model='password' />
        </div>

        <div class='text-right button-container'>
            <button class='btn btn-primary'>Sign in</button>
        </div>

    </form>
</template>

<script>
export default {
    name: 'LoginView',

    data() {
        return {
            user: '',
            password: '',
        };
    },

    methods: {
        formSubmitted() {
            // TODO Login
        },
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
    background: url('https://images.unsplash.com/photo-1637433926966-c433757b0222?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80') center center no-repeat;
    background-size: cover;
}
</style>