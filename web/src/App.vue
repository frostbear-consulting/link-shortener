<script>
import 'spectre.css';
import { useTitle } from '@/lib';
import Dropdown from '@/components/Dropdown';

export default {
    name: 'App',

    components: {
        Dropdown,
    },

    data() {
        return {
            name: 'Rainer Zufall',
            counter: 0,
        };
    },

    methods: {
        changeName() {
            this.name = 'Dr. Med. Wurst';
        },

        hovered() {
            this.counter = (this.counter + 1) % 255;
        },
    },

    computed: {
        style() {
            return `background: rgb(${this.counter}, ${255 - this.counter}, 0)`;
        },
    },

    mounted() {
        useTitle('Starteseite');
    },
};
</script>

<template>
    <div>
        <h2>Hallo: {{ name }}</h2>
        <button type='button'
                @click='changeName'
                @mousemove='hovered'
                :style='style'
                class='btn btn-primary'>
            Click me
            ({{ counter }})
        </button>

        <Dropdown></Dropdown>
        <Dropdown />
    </div>
</template>