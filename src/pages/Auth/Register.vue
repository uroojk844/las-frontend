<script setup>
import { RouterLink } from "vue-router";
import FilledButton from "@/components/FilledButton.vue";
import useUserStore from "@/store/user";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { getIsLoading } = storeToRefs(userStore);
const user = ref({
    password: "",
    cpassword: ""
});

const isMatching = computed(() => user.value.password === user.value.cpassword);
</script>

<template>
    <section class="grid lg:grid-cols-2 min-h-screen">
        <div class="hidden p-6 bg-primary lg:grid place-items-center text-white ">
            <h1 class="text-5xl max-w-lg text-center text-pretty leading-[1.5] font-medium">Welcome to <br> Little Angel
                School Management System</h1>
        </div>
        <div class="grid  content-center p-6 bg-secondary">
            <form @submit.prevent="" method="POST"
                class="max-w-md w-full mx-auto bg-white px-8 py-12 rounded-lg shadow">
                <h1 class="text-2xl font-bold mb-6 text-center">Create an account</h1>
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" name="name" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" minlength="8" id="password" v-model="user.password" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div class="mb-4">
                    <label for="cpassword" minlength="8" class="block text-sm font-medium text-gray-700">Confirm
                        Password</label>
                    <input type="password" id="cpassword" v-model="user.cpassword" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <FilledButton class="w-full" :isLoading="getIsLoading" :disabled="!isMatching">
                    Register
                </FilledButton>
                <div class="mt-4">
                    <p class="text-sm text-dark-gray">Already have an account? <RouterLink to="/auth/login"
                            class="text-primary hover:underline">Login</RouterLink>
                    </p>
                </div>
            </form>
        </div>
    </section>
</template>