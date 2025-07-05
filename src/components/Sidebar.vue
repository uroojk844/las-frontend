<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric, RouterLink } from "vue-router";
import useUserStore from "@/store/user";
import { handleClickedOutside } from "@/utils/handleClickOutside";
import { TUserRole } from "@/store/user.interface";
import { useThemeStore } from "@/store/theme.store";
import { storeToRefs } from "pinia";

interface ILink {
  name: string,
  icon?: string,
  path?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
  permission?: TUserRole[]
  children?: ILink[]
}

const sidebarLinks: ILink[] = [
  { name: "Dashboard", icon: "material-symbols:space-dashboard-rounded", path: "/" },
  {
    name: "Student", icon: "ph:student-fill",
    children: [
      { name: "All Students", path: "/student" },
      {
        name: "Add Student", path: "/student/add",
        permission: ["admin", "super"]
      },
    ]
  },
  {
    name: "Admin", icon: "material-symbols:admin-panel-settings-rounded",
    permission: ["super"],
    children: [
      { name: "All users", path: "/admin" },
      { name: "Create user", path: "/admin/create" },
    ]
  },
  {
    name: "Fee", icon: "ri:money-rupee-circle-fill",
    children: [
      { name: "Submit", path: "/fee", permission: ["admin","super"] },
      { name: "Details", path: "/fee/details", permission: ["admin","super"] },
      { name: "Report", path: "/fee/report" },
    ]
  },
  {
    name: "Book", icon: "material-symbols:book-3-rounded",
    children: [
      { name: "List", path: "/books" },
      { name: "Buy", path: "/books/buy", permission: ["admin","super"] },
      { name: "Edit", path: "/books/edit", permission: ["super"] },
    ]
  },
  {
    name: "Uniform", icon: "ri:shirt-fill",
    children: [
      { name: "List", path: "/uniform" },
      { name: "Buy", path: "/uniform/buy", permission: ["admin","super"] },
      { name: "Edit", path: "/uniform/edit", permission: ["super"] },
    ]
  },
];

const sidebar = ref(null);
const isSidebarOpen = inject<boolean>("isSidebarOpen");

const themeStore = useThemeStore();
const { getTheme } = storeToRefs(themeStore);

handleClickedOutside(sidebar, isSidebarOpen as any);

const userStore = useUserStore();

const isAllowedLinks = computed<(ILink | undefined)[]>(() => {
  const userRole = userStore.user?.role;
  return sidebarLinks
    .map(link => {
      // Check parent permission
      if (link.permission && !link.permission.includes(userRole as TUserRole)) return;

      // If has children, filter children by permission
      if (link.children) {
        const allowedChildren = link.children.filter(child => {
          if (!child.permission) return true;
          return child.permission.includes(userRole as TUserRole);
        });
        // Only return parent if it has allowed children
        if (allowedChildren.length > 0) {
          return { ...link, children: allowedChildren };
        }
        return;
      }

      return link;
    })
    .filter(Boolean);
});
</script>

<template>
  <aside :class="{ open: isSidebarOpen }" ref="sidebar" class="w-64 h-full p-4">
    <div class="text-2xl font-bold mb-2 text-accent">LASMS</div>
    <div v-for="(item, index) in isAllowedLinks" :key="index">
      <details :open="item?.children?.map(c => c.path).includes($route.path)" v-if="item?.children"
        class="group [&:has(.router-link-exact-active)>summary]:text-accent">
        <summary class="flex items-center gap-2 p-2 rounded text-light-gray hover:text-accent cursor-pointer">
          <icon :icon="item?.icon" class="size-6" /> {{ item?.name }}
          <span class="ml-auto">
            <icon icon="tabler:chevron-down" class="text-xl -rotate-90 group-open:rotate-0 transition-transform" />
          </span>
        </summary>

        <div class="border-l-2 border-secondary ml-4 space-y-2">
          <RouterLink :to="child.path as string" v-for="(child, index) in item?.children" :key="index"
            class="child-link ml-4 flex items-center gap-2 p-2 rounded hover:bg-secondary text-light-gray hover:text-accent">
            {{ child.name }}
          </RouterLink>
        </div>
      </details>

      <RouterLink v-else :to="item?.path as string"
        class="flex items-center gap-2 p-2 rounded hover:bg-secondary text-light-gray hover:text-accent">
        <icon :icon="item?.icon" class="size-6" />
        {{ item?.name }}
      </RouterLink>
    </div>

    <div @click="themeStore.toggleTheme"
      class="mt-auto cursor-pointer flex items-center gap-2 p-2 rounded text-light-gray">
      <icon icon="fluent:dark-theme-20-filled" class="size-6" />
      Dark theme

      <span class="text-2xl ml-auto" title="Toggle dark theme">
        <icon v-if="getTheme == 'light'" icon="ph:toggle-left" />
        <icon v-else icon="ph:toggle-right-fill" />
      </span>
    </div>


    <div class="sidebarToggleBtn" @click="isSidebarOpen = !isSidebarOpen">
      <icon icon="uil:times" />
    </div>
  </aside>
</template>

<style scoped>
@reference "@/style.css";

aside {
  @apply flex flex-col gap-2 bg-surface border-r border-border transition-transform print:hidden;

  @media screen and (width < 48rem) {
    @apply absolute top-0 left-0 -translate-x-full w-64 h-full z-50;

    &.open {
      @apply translate-x-0;

      .sidebarToggleBtn {
        @apply translate-x-12;
      }
    }
  }

  .sidebarToggleBtn {
    @apply md:hidden absolute bg-surface text-xl hover:text-red-400 h-8 w-8 rounded-full grid place-items-center top-1/2 right-0 translate-x-0 transition-transform duration-300 border border-border cursor-pointer;
  }
}

.child-link.router-link-exact-active {
  position: relative;

  &::before {
    content: "";
    @apply absolute -left-[17px] -translate-x-1/2 rounded-full top-0 h-full w-1 bg-primary;
  }
}
</style>