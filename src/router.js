import { createRouter, createWebHistory } from "vue-router";
import Auth from "./pages/Auth/Auth.vue";
import Login from "./pages/Auth/Login.vue";
import useUserStore from "./store/user.js";

export const router = createRouter({
    routes: [
        {
            path: "/auth",
            name: "Auth",
            component: Auth,
            children: [
                {
                    path: "login",
                    name: "Login",
                    component: Login,
                },
                {
                    path: "register",
                    name: "Register",
                    component: () => import("./pages/Auth/Register.vue")
                }
            ]
        },
        {
            path: "/",
            name: "Layout",
            component: () => import("./Layout.vue"),
            children: [
                {
                    path: "",
                    name: "Dashboard",
                    component: () => import("./pages/Dashboard.vue")
                },
                {
                    path: "students",
                    name: "Students",
                    component: () => import("./pages/Students.vue")
                }
            ]
        },

    ],
    history: createWebHistory(),
})

const authPages = ['Login', 'Register'];

const isAuthPage = (route) => {
    return authPages.includes(route.name);
}

const isAuthenticated = () => {
    const userStore = useUserStore();
    return userStore.getIsAuthenticated;
}

router.beforeEach((to, from, next) => {
    if (!isAuthenticated() && !isAuthPage(to)) next({ name: 'Login' })
    else if (isAuthPage(to) && isAuthenticated()) next({ name: 'Dashboard' })
    else next();
})