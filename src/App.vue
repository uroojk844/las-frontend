<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { RouterView } from "vue-router";
import useUserStore from "@/store/user.js";
import { auth } from "@/firebase";
import { router } from "./router";

const userStore = useUserStore();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userStore.setUser({
      email: user.email,
      name: user.displayName,
      photo: user.photoURL,
    });
    const res = await fetch(`https://lasms.proficiosoftware.com/?email=${userStore.getUser.email}`)
    const data = await res.json();
    userStore.setUser({
      ...userStore.getUser,
      role: data.role,
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
