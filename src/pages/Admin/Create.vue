<script setup>
import FilledButton from '@/components/FilledButton.vue';
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
const userStore = useUserStore();
const { getIsLoading } = storeToRefs(userStore);

const user = ref({
    password: '',
    cpassword: ''
});

const isMatching = computed(() => user.value.password === user.value.cpassword);
</script>
<template>
    <section class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Create admin</h1>
    </section>


    <section class="grid bg-white p-4 rounded-md">
        <form @submit.prevent="userStore.createAdmin" class="space-y-4">
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
        </form>
    </section>
</template>