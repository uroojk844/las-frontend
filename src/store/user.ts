import { defineStore } from "pinia";
import { auth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { nextTick } from "vue";
import { useAlertStore } from "./Alert";
import { IUser, IUserStore } from "./user.interface";
import { getFormData } from "@/utils/getFormData";
import { axiosInstance } from "@/utils/api";

const useUserStore = defineStore("userStore", {
  state: (): IUserStore => ({
    user: null,
    isLoading: false,
  }),
  getters: {
    getUser: (state) => state.user,
    getIsLoading: (state) => state.isLoading,
    getRole: (state) => state.user?.role,
    getIsAdmin: (state) => state.user?.role === "admin",
  },
  actions: {
    setUser(user: IUser | null) {
      this.user = user;
    },
    async login(event: Event) {
      this.isLoading = true;
      const formData = getFormData(event);
      const { email, password } = Object.fromEntries(formData);
      try {
        await setPersistence(auth, browserLocalPersistence);
        await signInWithEmailAndPassword(
          auth,
          email as string,
          password as string
        );
      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.showAppAlert("Wrong email or password!!", "error");
      } finally {
        this.isLoading = false;
      }
    },
    async addAdmin(formData: FormData) {
      const alertStore = useAlertStore();
      try {
        const { data } = await axiosInstance.post(
          "/users/add-admin/",
          formData
        );
        if (data?.success) {
          alertStore.showAppAlert(data.success);
        } else {
          alertStore.showAppAlert(data.error, "error");
        }
      } catch (error: any) {
        alertStore.showAppAlert(error, "error");
      }
    },
    async createAdmin(event: Event) {
      const router = useRouter();
      this.isLoading = true;
      await nextTick();
      const formData = getFormData(event);
      const { email, password, name } = Object.fromEntries(formData);
      const response = await createUserWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      await Promise.all([
        updateProfile(response.user, { displayName: name as string }),
        this.addAdmin(formData),
      ]);
      router.push("/admin");
      this.isLoading = false;
    },
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
    async logout() {
      await auth.signOut();
    },
  },
});

export default useUserStore;
