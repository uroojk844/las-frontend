<script setup lang="ts">
import { inject } from "vue";
import { RouterLink } from "vue-router";

const sidebarLinks = [
  { name: "Dashboard", icon: "material-symbols:space-dashboard-rounded", path: "/" },
  {
    name: "Students", icon: "material-symbols:group-rounded", path: "/students",
    children: [
      { name: "All Students", path: "/students" },
      { name: "Add Student", path: "/students/add" },
    ]
  },
];

const isSidebarOpen = inject("isSidebarOpen");
</script>

<template>
  <aside :class="{ open: isSidebarOpen }" class="w-64 h-full p-4 bg-white border-r border-gray-200 transition-all ">
    <div class="text-2xl font-bold mb-2 text-accent">LASMS</div>

    <div v-for="(item, index) in sidebarLinks" :key="index">
      <details v-if="item?.children" class="[&[open]>summary]:text-accent">
        <summary
          class="flex items-center gap-2 p-2 rounded text-[#8b8b8b] hover:text-accent cursor-pointer transition-colors mb-2">
          <icon :icon="item.icon" class="text-xl" /> {{ item.name }}
          <span class="ml-auto">
            <icon icon="tabler:chevron-down" class="text-xl" />
          </span>
        </summary>

        <div class="border-l-2 border-secondary ml-4">
          <RouterLink :to="child.path" v-for="(child, index) in item.children" :key="index"
            class="child-link ml-4 flex items-center gap-2 p-2 rounded hover:bg-secondary text-[#8b8b8b] hover:text-accent transition-colors mb-2">
            {{ child.name }}
          </RouterLink>
        </div>
      </details>

      <RouterLink v-else :to="item.path"
        class="flex items-center gap-2 p-2 rounded hover:bg-secondary text-[#8b8b8b] hover:text-accent transition-colors">
        <icon :icon="item.icon" class="text-xl" />
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