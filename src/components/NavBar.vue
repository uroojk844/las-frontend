<script setup>
import { inject } from "vue";
import UserButton from "./UserButton.vue";
import { Icon } from "@iconify/vue";

const isSidebarOpen = inject("isSidebarOpen");
</script>

<template>
    <nav class="w-full flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
        <div class="flex items-center gap-4 flex-1">
            <button @click.stop="isSidebarOpen = !isSidebarOpen" class="md:hidden">
                <Icon icon="gravity-ui:bars" class="text-xl text-accent" />
            </button>

            <form class="max-sm:hidden flex items-center bg-background h-8 rounded overflow-hidden max-w-xs w-full">
                <input type="search" placeholder="Search" class="h-full p-2 w-full" />
                <button class="px-2 text-accent">
                    <Icon icon="ph:magnifying-glass-bold" />
                </button>
            </form>
        </div>
        <div class="flex items-center space-x-4">
            <div class="bg-secondary/50 w-8 h-8 rounded-full grid place-items-center">
                <Icon icon="ph:bell" />
            </div>
            <UserButton />
        </div>
    </nav>
</template>