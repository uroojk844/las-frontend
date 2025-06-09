import { defineStore } from "pinia";

export const useUsersStore = defineStore("usersStore", {
    state: () => ({
        users: [],
        isLoadingUsers: false,
    }),
    getters: {
        getUsers: (state) => state.users,
        getIsLoadingUsers: (state) => state.isLoading,
    },
    actions: {
        async fetchUsers() {
            this.isLoading = true;
            const response = await fetch('https://lasms.proficiosoftware.com/users/all/');
            try {
                this.users = await response.json();
            } catch (error) {
                console.error("Error fetching users:", error);
                this.users = [];
            } finally {
                this.isLoading = false;
            }
        },
    }
});