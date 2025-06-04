import { defineStore } from "pinia";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, updateCurrentUser } from "firebase/auth";
import { useRouter } from "vue-router";
import { nextTick } from "vue";

const useUserStore = defineStore("userStore", {
    state: () => ({
        user: null,
        isLoading: false,
    }),
    getters: {
        getUser: (state) => state.user,
        getIsLoading: (state) => state.isLoading,
        getRole: (state) => state.user,
        getIsAdmin: (state) => state.user?.role === "admin",
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        async login(event) {
            this.isLoading = true;
            const formData = new FormData(event.target);
            const { email, password } = Object.fromEntries(formData);
            await signInWithEmailAndPassword(auth, email, password);
            this.isLoading = false;
        },
        async createAdmin(event) {
            const router = useRouter();
            this.isLoading = true;
            await nextTick();
            const formData = new FormData(event.target);
            const { email, password, name } = Object.fromEntries(formData);
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(response.user, { displayName: name });
            router.push("/admin");
            this.isLoading = false;
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
