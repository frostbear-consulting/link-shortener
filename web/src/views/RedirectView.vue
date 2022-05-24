<template>
    <h1>REDIRECT</h1>
</template>

<script>
export default {
    name: 'Redirect',

    mounted() {
        const token = this.$route.params.token;

        // TODO: Request link from API

        // TODO: Redirect
        //          location.href = ...
    },
};
</script>