<script setup>
import FilledButton from '@/components/FilledButton.vue';
import Loader from "@/components/Loader.vue"
import { RouterLink } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useUsersStore } from '@/store/users';
import { storeToRefs } from 'pinia';
import MainHeader from '@/components/MainHeader.vue';

const usersStore = useUsersStore();
const { getUsers, getIsLoadingUsers } = storeToRefs(usersStore);

const filter = ref('');
const roleFilter = ref('');

const filteredUsers = computed(() => getUsers.value.filter(u => u.role.toLowerCase().includes(roleFilter.value.toLowerCase()))
    .filter(student => {
        return student.name.toLowerCase().includes(filter.value.toLowerCase()) ||
            student.id.toString().includes(filter.value);
    }));

onMounted(() => {
    usersStore.fetchUsers();
})
</script>

<template>
    <MainHeader title="Users List">
        <RouterLink to="/admin/create">
            <FilledButton>
                <icon icon="ph:plus-bold" /> Create user
            </FilledButton>
        </RouterLink>
    </MainHeader>

    <section class="grid bg-white p-4 rounded-md">
        <div class="flex items-center mb-4 gap-4">
            <h1 class="text-xl font-medium mr-auto whitespace-nowrap truncate">Users information</h1>
            <div
                class="max-sm:hidden flex items-center gap-2 px-2 bg-background h-8 rounded overflow-hidden max-w-56 w-full">
                <input type="search" v-model="filter" placeholder="Search by name or id" class="h-full w-full" />
                <icon icon="ph:magnifying-glass-bold" />
            </div>
            <div class="max-sm:hidden flex items-center gap-2 px-2 bg-background h-8 rounded max-w-32 w-full">
                <select v-model="roleFilter" placeholder="Search by name or id" class="h-full w-full">
                    <option value="">Select</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <icon icon="material-symbols:filter-list-rounded" />
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
                    <tr v-for="(user, index) in filteredUsers" :key="index" class="hover:bg-background cursor-pointer"
                        @click="() => $router.push('/admin/view/' + user.id)" title="Click to view details">
                        <td class="flex items-center gap-2 cursor-pointer">
                            <img class="size-8 rounded-full" :src="'https://picsum.photos/30.webp?random=' + index"
                                :alt="user.name">
                            {{ user.name }}
                        </td>
                        <td>{{ user.id }}</td>
                        <td class="capitalize">{{ user.role }}</td>
                        <td>{{ user.dob }}</td>
                        <td>{{ user.mobile }}</td>
                        <td>{{ user.address }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Loader v-else-if="getIsLoadingUsers" />
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