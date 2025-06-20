<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { RouterView, useRoute } from "vue-router";
import useUserStore from "@/store/user.js";
import { auth } from "@/firebase";
import { router } from "@/router";
import Alert from "@/components/Alert.vue";

const userStore = useUserStore();
const route = useRoute()

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userStore.setUser({
      email: user.email,
      name: user.displayName,
      photo: user.photoURL,
    });
    const res = await fetch(`https://lasms.proficiosoftware.com/users/by-email/?email=${userStore.getUser.email}`)
    const data = await res.json();
    userStore.setUser({
      ...userStore.getUser,
      ...data,
    });
    router.push(route.redirectedFrom?.path || "/");
  } else {
    userStore.setUser(null);
    router.push("/auth/login");
  }
});

</script>

<template>
  <RouterView></RouterView>
  <Alert />
</template>

<style></style>
