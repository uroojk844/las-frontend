import { defineStore } from "pinia";
import { auth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        token: null,
        isLoading: false,
    }),
    getters: {
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        getIsLoading: (state) => state.isLoading,
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        async googleLogin() {
            await signInWithPopup(auth, new GoogleAuthProvider())
        },
        async register() {
            // const user = await createUserWithEmailAndPassword(auth, "admin@lasms.com", "admin123");
            // await signInWithEmailAndPassword(auth,)
        },
        setToken(token) {
            this.token = token;
        },
        setLoading(loading) {
            this.isLoading = loading;
        },
        async logout() {
            await auth.signOut();
        },
    },
});

export default useUserStore;
