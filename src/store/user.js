import { defineStore } from "pinia";
import { router } from "../router";

const useUserStore = defineStore("user", {
    state: () => ({
        user: localStorage.getItem("isAuthenticated") ? {
            id: '12345',
            name: 'John Doe',
            email: 'john.doe@example.com',
        } : null,
        token: null,
        isAuthenticated: localStorage.getItem("isAuthenticated") || false,
        isLoading: false,
    }),
    getters: {
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        getIsAuthenticated: (state) => state.isAuthenticated,
        getIsLoading: (state) => state.isLoading,
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        login() {
            this.user = {
                id: '12345',
                name: 'John Doe',
                email: 'john.doe@example.com',
            };
            this.isAuthenticated = true;
            localStorage.setItem("isAuthenticated", "true");
            router.push({ name: "Dashboard" });
        },
        setToken(token) {
            this.token = token;
        },
        setLoading(loading) {
            this.isLoading = loading;
        },
        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            localStorage.removeItem("isAuthenticated");
            router.push({ name: "Login" });
        },
    },
});

export default useUserStore;
