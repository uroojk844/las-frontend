<script setup>
import FilledButton from '@/components/FilledButton.vue';
import { RouterLink } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useUsersStore } from '@/store/users';
import { storeToRefs } from 'pinia';
import MainHeader from '@/components/MainHeader.vue';
import TableAdaptor from '@/components/TableAdaptor.vue';

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
        <TableAdaptor :loading="getIsLoadingUsers" title="Users information" :headers="['User', 'ID', 'Role', 'DOB', 'Mobile', 'Address']"
            :data="getUsers" filterBy="role">
            <template #default="{ data }">
                <tr v-for="(user, index) in data" :key="index" class="hover:bg-background cursor-pointer"
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
            </template>
        </TableAdaptor>
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