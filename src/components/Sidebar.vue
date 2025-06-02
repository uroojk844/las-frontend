<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { inject } from "vue";
import { RouterLink } from "vue-router";

const sidebarLinks = [
  { name: "Dashboard", icon: "material-symbols:space-dashboard-rounded", path: "/" },
  { name: "Students", icon: "material-symbols:group-rounded", path: "/students" },
];

const isSidebarOpen = inject("isSidebarOpen");
</script>

<template>
  <aside :class="{ open: isSidebarOpen }" class="w-64 h-full p-4 bg-white border-r border-gray-200 transition-all ">
    <div class="text-2xl font-bold mb-2 text-accent">LASMS</div>
    <RouterLink v-for="(item, index) in sidebarLinks" :key="index" :to="item.path"
      class="flex items-center gap-2 p-2 rounded hover:bg-secondary hover:text-accent transition-colors">
      <Icon :icon="item.icon" class="text-xl" /> {{ item.name }}
    </RouterLink>

    <div class="sidebarToggleBtn" @click="isSidebarOpen = !isSidebarOpen">
      <Icon icon="uil:times" />
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
</style>