<script setup lang="ts">
import useUserStore from "@/store/user.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import FilledButton from "./FilledButton.vue";
import Avatar from "./Avatar.vue";
const userStore = useUserStore();
const { getUser } = storeToRefs(userStore);

const isOpen = ref(false);
</script>

<template>
    <section class="relative">
        <button popovertarget="menu" @click="isOpen = !isOpen" class="flex gap-x-2 cursor-pointer">
            <Avatar :id="getUser?.id" :photo="getUser?.photo" />
            <div class="text-start">
                <div class="text-sm text-dark-gray">{{ getUser?.name || 'User' }}</div>
                <div class="text-xs text-light-gray capitalize">{{ getUser?.role }}</div>
            </div>
        </button>
        <div popover id="menu"
            class="text-dark-gray inset-auto max-w-xs absolute top-0 translate-y-20 right-4 p-4 bg-surface rounded-lg border border-border text-sm">
            <Avatar :id="getUser?.id" :photo="getUser?.photo" class="size-12 mb-2" />
            <div>{{ getUser?.name || 'User' }}</div>
            <a :href="'mailto:' + getUser?.email" class="text-light-gray break-all block mb-4">{{ getUser?.email }}</a>
            <FilledButton type="danger" size="sm" @click="userStore.logout">Logout</FilledButton>
        </div>
    </section>
</template>