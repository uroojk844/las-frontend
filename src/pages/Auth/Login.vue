<script setup lang="ts">
import { RouterLink } from "vue-router";
import useUserStore from "@/store/user";
import FilledButton from "@/components/FilledButton.vue";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { getIsLoading } = storeToRefs(userStore);
</script>

<template>
  <section class="grid lg:grid-cols-2 min-h-screen">
    <div class="hidden p-6 bg-primary lg:grid place-items-center text-white ">
      <h1 class="text-5xl max-w-lg text-center text-pretty leading-[1.5] font-medium">Welcome to <br> Little Angel
        School Management System</h1>
    </div>
    <div class="grid  content-center p-6 bg-secondary">
      <form @submit.prevent="userStore.login" class="max-w-md w-full mx-auto bg-surface px-8 py-12 rounded-lg shadow">
        <h1 class="text-2xl font-bold mb-6 text-center">Login to continue</h1>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-dark-gray">Email</label>
          <input type="email" id="email" name="email" required
            class="mt-1 block w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-dark-gray">Password</label>
          <input type="password" id="password" name="password" required
            class="mt-1 block w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        </div>
        <FilledButton class="w-full" :isLoading="getIsLoading">Login</FilledButton>
        <div class="mt-4">
          <p class="text-sm text-dark-gray">Don't have an account? <RouterLink to="/auth/register"
              class="text-primary hover:underline">Register</RouterLink>
          </p>
        </div>
        <!-- <div class="max-w-md w-full mx-auto">
          <p class="text-sm text-gray-600 my-4 text-center">or</p>
          <button type="button" class="border w-full rounded py-2 flex items-center gap-2 justify-center bg-surface border-border"
            @click="userStore.googleLogin">
            <Icon icon="logos:google-icon" /> Continue with Google
          </button>
        </div> -->
      </form>
    </div>
  </section>
</template>