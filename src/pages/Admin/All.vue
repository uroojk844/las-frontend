<script setup>
import FilledButton from '@/components/FilledButton.vue';
import { RouterLink } from 'vue-router';
import users from '@/assets/users.json';
import { computed, ref } from 'vue';

const filter = ref('');

const filteredUsers = computed(() => users.filter(student => {
    return student.name.toLowerCase().includes(filter.value.toLowerCase()) ||
        student.roll.toString().includes(filter.value);
}));
</script>

<template>
    <section class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Users List</h1>
        <RouterLink to="/admin/create">
            <FilledButton>
                <icon icon="ph:plus-bold" /> Create user
            </FilledButton>
        </RouterLink>
    </section>

    <section class="grid bg-white p-4 rounded-md">
        <div class="flex items-center mb-4">
            <h1 class="text-xl font-medium mr-auto">Users information</h1>
            <div
                class="max-sm:hidden flex items-center gap-2 bg-background h-8 rounded overflow-hidden max-w-64 w-full">
                <input type="search" v-model="filter" placeholder="Search by name or id" class="h-full pl-2 w-full" />
                <icon icon="ph:magnifying-glass-bold" />
            </div>
        </div>

        <div v-if="filteredUsers.length" class="overflow-x-auto">
            <table class="table table-auto w-full rounded-md overflow-hidden whitespace-nowrap">
                <thead>
                    <tr class="bg-secondary text-light-gray font-medium">
                        <td>User</td>
                        <td>ID</td>
                        <td>Role</td>
                        <td>DOB</td>
                        <td>Mobile</td>
                        <td>Address</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in filteredUsers" :key="index"
                        class="hover:bg-background cursor-pointer"
                        @click="() => $router.push('/admin/view/' + user.id)"
                        title="Click to view details">
                        <td class="flex items-center gap-2 cursor-pointer">
                            <img class="size-8 rounded-full" :src="'https://picsum.photos/30.webp?random=' + index"
                                :alt="user.name">
                            {{ user.name }}
                        </td>
                        <td>{{ user.id }}</td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.dob }}</td>
                        <td>{{ user.mobile }}</td>
                        <td>{{ user.address }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-light-gray text-center py-8">Nothing to show here</div>
    </section>
</template>

<style scoped>
@reference "@/style.css";

td {
    @apply p-2;
}

input[type="checkbox"] {
    @apply w-4 h-4 cursor-pointer;
}
</style>