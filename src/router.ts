import {
  createRouter,
  createWebHistory,
  RouteLocationNormalizedGeneric,
} from "vue-router";
import Auth from "@/pages/Auth/Auth.vue";
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
          component: () => import("@/pages/Auth/Login.vue"),
        },
        {
          path: "register",
          name: "Register",
          component: () => import("@/pages/Auth/Register.vue"),
        },
      ],
    },
    {
      path: "/",
      name: "Layout",
      component: () => import("@/Layout.vue"),
      children: [
        {
          path: "",
          name: "Dashboard",
          component: () => import("@/pages/Dashboard.vue"),
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
              component: () => import("@/pages/Student/Add.vue"),
              meta: { permission: ["admin", "super"] },
            },
          ],
        },
        {
          path: "admin",
          name: "Admin",
          meta: { permission: ["super"] },
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
          component: () => import("@/pages/Fee/FeeView.vue"),
          children: [
            {
              name: "SubmitFee",
              path: "",
              component: () => import("@/pages/Fee/Submit.vue"),
              meta: { permission: ["admin", "super"] },
            },
            {
              name: "FeeDetail",
              path: "details",
              component: () => import("@/pages/Fee/Details.vue"),
              meta: { permission: ["admin", "super"] },
            },
            {
              name: "FeeReport",
              path: "report",
              component: () => import("@/pages/Fee/Report.vue"),
            },
          ],
        },
        {
          path: "books",
          name: "Book",
          component: () => import("@/pages/book/BookView.vue"),
          children: [
            {
              name: "AllBooks",
              path: "",
              component: () => import("@/pages/book/All.vue"),
            },
            {
              name: "BuyBook",
              path: "buy",
              meta: { permission: ["admin", "super"] },
              component: () => import("@/pages/book/Buy.vue"),
            },
            {
              name: "EditBook",
              path: "edit",
              meta: { permission: ["super"] },
              component: () => import("@/pages/book/Edit.vue"),
            },
          ],
        },
        {
          path: "uniform",
          name: "Uniform",
          component: () => import("@/pages/uniform/UniformView.vue"),
          children: [
            {
              name: "AllUniform",
              path: "",
              component: () => import("@/pages/uniform/All.vue"),
            },
            {
              name: "BuyUniform",
              path: "buy",
              meta: { permission: ["admin", "super"] },
              component: () => import("@/pages/uniform/Buy.vue"),
            },
            {
              name: "EditUniform",
              path: "edit",
              meta: { permission: ["super"] },
              component: () => import("@/pages/uniform/Edit.vue"),
            },
          ],
        },
      ],
    },
  ],
  history: createWebHistory(),
});

const authPages = ["Login", "Register"];

const isAuthPage = (route: RouteLocationNormalizedGeneric) => {
  return authPages.includes(route.name as string);
};

const isAuthenticated = () => {
  const userStore = useUserStore();
  return !!userStore.getUser;
};

const isAdmin = () => {
  const userStore = useUserStore();
  return userStore.getUser?.role;
};

router.beforeEach((to, from, next) => {
  if (!isAuthenticated() && !isAuthPage(to)) next({ name: "Login" });
  else if (isAuthPage(to) && isAuthenticated()) next({ name: "Dashboard" });
  else if (
    to.meta.permission &&
    !(to.meta.permission as string[]).includes(isAdmin() as string) &&
    isAuthenticated()
  )
    next({ name: "Dashboard" });
  else next();
});
