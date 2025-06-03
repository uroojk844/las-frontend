<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { RouterView } from "vue-router";
import useUserStore from "@/store/user.js";
import { auth } from "@/firebase";
import { router } from "./router";

const userStore = useUserStore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    userStore.setUser({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photo: user.photoURL,
    });
    router.push("/");
  } else {
    userStore.setUser(null);
    router.push("/auth/login");
  }
});

</script>

<template>
  <RouterView></RouterView>
</template>

<style></style>
