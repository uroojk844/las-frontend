<script setup lang="ts">
import { RouterView } from "vue-router";
import useUserStore from "./store/user.js";
import Sidebar from "./components/Sidebar.vue";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { getUser } = storeToRefs(userStore);
</script>

<template>
  <section class="flex w-full h-screen">
    <Sidebar />
    <section class="flex-1 flex flex-col">
      <nav class="w-full flex justify-between items-center p-4 bg-slate-950 text-white">
        <h1>Hello, {{ getUser?.name }}</h1>
        <button @click="userStore.logout()">Logout</button>
      </nav>
      <main class="h-full overflow-y-auto">
        <RouterView />
      </main>
    </section>
  </section>
</template>
