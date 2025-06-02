<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import NavBar from "@/components/NavBar.vue";
import { provide, ref } from "vue";
const isSidebarOpen = ref(false);

provide("isSidebarOpen", isSidebarOpen);
</script>

<template>
  <section class="flex w-full h-screen">
    <Sidebar />
    <section class="flex-1 flex flex-col">
      <NavBar />
      <main class="h-full overflow-y-auto p-4">
        <RouterView />
      </main>
    </section>
  </section>
</template>
