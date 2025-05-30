<script setup>
import useUserStore from "../../store/user";

const userStore = useUserStore();
</script>

<template>
  <button @click="userStore.login()">Login</button>
</template>
