<script setup>
import useUserStore from "@/store/user.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const userStore = useUserStore();
const { getUser } = storeToRefs(userStore);

const isOpen = ref(false);
</script>

<template>
    <section class="relative">
        <button popovertarget="menu" @click="isOpen = !isOpen" class="flex gap-x-2 cursor-pointer">
            <img src="https://picsum.photos/40.webp" alt="user avatar"
                class="w-8 h-8 object-cover object-center rounded-full">
            <div class="text-start">
                <div class="text-sm">{{ getUser?.name }}</div>
                <div class="text-xs text-light-gray">Admin</div>
            </div>
        </button>
        <div popover id="menu"
            class="inset-auto w-52 absolute top-0 translate-y-20 right-4 p-4 bg-white rounded-xl border border-gray-200 text-sm">
            <img src="https://picsum.photos/40.webp" alt="user avatar"
                class="w-12 aspect-square object-cover object-center rounded mb-2">
            <div>{{ getUser?.name }}</div>
            <div class="text-light-gray mb-4">{{ getUser?.email }}</div>
            <button class="bg-red-400 text-white py-1 px-3 rounded" @click="userStore.logout()">Logout</button>
        </div>
    </section>
</template>