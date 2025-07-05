<script setup lang="ts">
import FilledButton from '@/components/FilledButton.vue';
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import RadioGroup from '@/components/RadioGroup.vue';
const userStore = useUserStore();
const { getIsLoading } = storeToRefs(userStore);

const user = ref({
    password: '',
    cpassword: ''
});

const role = ref<'teacher' | 'admin' | 'super'>('teacher')

const isMatching = computed(() => user.value.password === user.value.cpassword);
</script>
<template>
    <MainHeader title="Create admin" />

    <section class="grid bg-surface p-4 rounded-md">
        <form @submit.prevent="userStore.createAdmin" class="space-y-4">
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-dark-gray">Name</label>
                <input type="text" id="name" name="name" required
                    class="mt-1 block w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-dark-gray">Email</label>
                <input type="email" id="email" name="email" required
                    class="mt-1 block w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <RadioGroup class="col-span-full" label="Role" name="role" v-model="role" :values="[
                {
                    label: 'Teacher',
                    value: 'teacher',
                },
                {
                    label: 'Admin',
                    value: 'admin',
                },
                {
                    label: 'Super Admin',
                    value: 'super',
                }
            ]" />
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-dark-gray">Password</label>
                <input type="password" name="password" minlength="8" id="password" v-model="user.password" required
                    class="mt-1 block w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <div class="mb-4">
                <label for="cpassword" minlength="8" class="block text-sm font-medium text-dark-gray">Confirm
                    Password</label>
                <input type="password" id="cpassword" v-model="user.cpassword" required
                    class="mt-1 block w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <FilledButton class="w-full" :isLoading="getIsLoading" :disabled="!isMatching">
                Register
            </FilledButton>
        </form>
    </section>
</template>