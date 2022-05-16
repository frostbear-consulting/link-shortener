<template>

    <div>
        <Navigation />

        <table class='table table-striped'>
            <thead>
            <tr>
                <th>Short link</th>
                <th>Original link</th>
                <th>Clicks</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for='link in links' :key='link.idLink'>
                <td>{{ link.token }}</td>
                <td>
                    <a :href='link.originalLink' target='_blank'>
                        {{ link.originalLink }}
                    </a>
                </td>
                <td>{{ link.clicks }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation';
import { GET } from '@/http-client';

export default {
    name: 'DashboardView',

    data() {
        return {
            links: [],
        };
    },

    components: {
        Navigation,

    },

    async mounted() {
        const response = await GET('api/links');

        this.links = response.body;
    },
};
</script>