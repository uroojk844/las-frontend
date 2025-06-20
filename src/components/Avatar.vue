<script setup>
import AvatarImage from "@/assets/user-avatar.svg";
const { photo, id } = defineProps(['photo', 'id']);
const IMG_URL = `${import.meta.env.VITE_IMG_URL}/${id}/${photo}`;
</script>

<template>
    <img class="size-8 object-cover object-center rounded-full" :src="IMG_URL" @error="$event.target.src = AvatarImage"
        :alt="photo">
</template>