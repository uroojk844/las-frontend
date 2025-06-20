import { createRouter, createWebHistory } from "vue-router";
import Auth from "@/pages/Auth/Auth.vue";
import Login from "@/pages/Auth/Login.vue";
import useUserStore from "@/store/user.js";

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
                    component: Login
                },
                {
                    path: "register",
                    name: "Register",
                    component: () => import("@/pages/Auth/Register.vue")
                }
            ]
        },
        {
            path: "/",
            name: "Layout",
            component: () => import("@/Layout.vue"),
            children: [
                {
                    path: "",
                    name: "Dashboard",
                    component: () => import("@/pages/Dashboard.vue")
                },
                {
                    path: "student",
                    name: "Student",
                    component: () => import("@/pages/Student/StudentView.vue"),
                    children: [
                        {
                            path: "",
                            name: "AllStudents",
                            component: () => import("@/pages/Student/All.vue"),
                        },
                        {
                            path: "view/:id",
                            name: "ViewStudent",
                            component: () => import("@/pages/Student/View.vue"),
                        },
                        {
                            path: "add",
                            name: "AddStudent",
                            meta: { permission: ["admin"] },
                            component: () => import("@/pages/Student/Add.vue"),
                        }
                    ],
                },
                {
                    path: "admin",
                    name: "Admin",
                    meta: { permission: ["admin"] },
                    component: () => import("@/pages/Admin/AdminView.vue"),
                    children: [
                        {
                            path: "",
                            name: "AllAdmins",
                            component: () => import("@/pages/Admin/All.vue"),
                        },
                        {
                            path: "view/:id",
                            name: "ViewAdmin",
                            component: () => import("@/pages/Admin/View.vue"),
                        },
                        {
                            path: "create",
                            name: "CreateAdmin",
                            component: () => import("@/pages/Admin/Create.vue"),
                        },
                    ],
                },
                {
                    path: "fee",
                    name: "Fee",
                    meta: { permission: ["admin"] },
                    component: () => import("@/pages/Fee/FeeView.vue"),
                    children: [
                        {
                            name: 'SubmitFee',
                            path: "",
                            component: () => import("@/pages/Fee/Submit.vue"),
                        },
                        {
                            name: 'FeeDetail',
                            path: "details",
                            component: () => import("@/pages/Fee/Details.vue"),
                        },
                        {
                            name: 'FeeReport',
                            path: "report",
                            component: () => import("@/pages/Fee/Report.vue"),
                        },
                    ]
                },
                {
                    path: "books",
                    name: "Book",
                    meta: { permission: ["admin"] },
                    component: () => import("@/pages/Book/BookView.vue"),
                    children: [
                        {
                            name: 'AllBooks',
                            path: "",
                            component: () => import("@/pages/Book/All.vue"),
                        },
                        {
                            name: 'BuyBook',
                            path: "buy",
                            component: () => import("@/pages/Book/Buy.vue"),
                        },
                        {
                            name: 'EditBook',
                            path: "edit",
                            component: () => import("@/pages/Book/Edit.vue"),
                        },
                    ]
                },
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
    return !!userStore.getUser;
}

const isAdmin = () => {
    const userStore = useUserStore();
    return userStore.getUser?.role === 'admin';
}

router.beforeEach((to, from, next) => {
    if (!isAuthenticated() && !isAuthPage(to)) next({ name: 'Login' })
    else if (isAuthPage(to) && isAuthenticated()) next({ name: 'Dashboard' })
    else if (to.meta.permission && !to.meta.permission.includes(isAdmin()) && !isAdmin() && isAuthenticated()) next({ name: 'Dashboard' })
    else next();
})