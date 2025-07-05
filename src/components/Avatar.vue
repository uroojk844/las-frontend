<script setup lang="ts">
import Avatar from "@/assets/user-avatar.svg";
const { photo, id } = defineProps(['photo', 'id']);
const IMG_URL = photo ? `${import.meta.env.VITE_IMG_URL}/${id}/${photo}` : Avatar;
</script>

<template>
    <img ref="img" class="size-8 object-cover object-center rounded-full" :src="IMG_URL"
        @error="($event.target as HTMLImageElement).src = Avatar" :alt="photo">
</template>