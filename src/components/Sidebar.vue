<script setup>
import { computed, inject, ref } from "vue";
import { RouterLink } from "vue-router";
import useUserStore from "@/store/user";
import { handleClickedOutside } from "../utils/handleClickOutside";

const sidebarLinks = [
  { name: "Dashboard", icon: "material-symbols:space-dashboard-rounded", path: "/" },
  {
    name: "Student", icon: "ph:student-fill",
    children: [
      { name: "All Students", path: "/student" },
      {
        name: "Add Student", path: "/student/add",
        permission: ["admin"]
      },
    ]
  },
  {
    name: "Admin", icon: "material-symbols:admin-panel-settings-rounded",
    permission: ["admin"],
    children: [
      { name: "All users", path: "/admin" },
      { name: "Create user", path: "/admin/create" },
    ]
  },
];

const sidebar = ref(null);
const isSidebarOpen = inject("isSidebarOpen");

handleClickedOutside(sidebar, isSidebarOpen);

const userStore = useUserStore();

const isAllowedLinks = computed(() => {
  const userRole = userStore.user?.role;
  return sidebarLinks
    .map(link => {
      // Check parent permission
      if (link.permission && !link.permission.includes(userRole)) return false;

      // If has children, filter children by permission
      if (link.children) {
        const allowedChildren = link.children.filter(child => {
          if (!child.permission) return true;
          return child.permission.includes(userRole);
        });
        // Only return parent if it has allowed children
        if (allowedChildren.length > 0) {
          return { ...link, children: allowedChildren };
        }
        return false;
      }

      return link;
    })
    .filter(Boolean);
});
</script>

<template>
  <aside :class="{ open: isSidebarOpen }" ref="sidebar"
    class="w-64 h-full p-4 bg-white border-r border-gray-200 transition-all ">
    <div class="text-2xl font-bold mb-2 text-accent">LASMS</div>

    <div v-for="(item, index) in isAllowedLinks" :key="index">
      <details v-if="item?.children" class="group [&:has(.router-link-exact-active)>summary]:text-accent">
        <summary
          class="flex items-center gap-2 p-2 rounded text-[#8b8b8b] hover:text-accent cursor-pointer transition-colors">
          <icon :icon="item.icon" class="size-6" /> {{ item.name }}
          <span class="ml-auto">
            <icon icon="tabler:chevron-down" class="text-xl -rotate-90 group-open:rotate-0 transition-transform" />
          </span>
        </summary>

        <div class="border-l-2 border-secondary ml-4 space-y-2">
          <RouterLink :to="child.path" v-for="(child, index) in item.children" :key="index"
            class="child-link ml-4 flex items-center gap-2 p-2 rounded hover:bg-secondary text-[#8b8b8b] hover:text-accent transition-colors">
            {{ child.name }}
          </RouterLink>
        </div>
      </details>

      <RouterLink v-else :to="item.path"
        class="flex items-center gap-2 p-2 rounded hover:bg-secondary text-[#8b8b8b] hover:text-accent transition-colors">
        <icon :icon="item.icon" class="size-6" />
        {{ item.name }}
      </RouterLink>
    </div>

    <div class="sidebarToggleBtn" @click="isSidebarOpen = !isSidebarOpen">
      <icon icon="uil:times" />
    </div>

  </aside>
</template>

<style scoped>
@reference "@/style.css";

aside {
  @apply flex flex-col gap-2 bg-white border-r border-gray-200 transition-all;

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
    @apply md:hidden absolute bg-white text-xl hover:text-red-400 h-8 w-8 rounded-full grid place-items-center top-1/2 right-0 translate-x-0 transition-transform duration-300 border border-gray-200 cursor-pointer;
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