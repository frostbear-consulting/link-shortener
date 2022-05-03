import { createStore } from 'vuex';

export const session = createStore({
    state() {
        return {
            idUser: null,
            firstName: null,
            lastName: null,
            email: null,
            name: null,
        };
    },

    getters: {
        isAuthenticated(state) {
            return null !== state.idUser;
        },
    },

    mutations: {
        signOut(state) {
            state.idUser = null;
            state.firstName = null;
            state.lastName = null;
            state.name = null;
            state.email = null;
        },

        signIn(state, idUser, firstName, lastName, name, email) {
            state.idUser = idUser;
            state.name = name;
            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
        },
    },
});