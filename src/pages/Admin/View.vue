<script setup>
import FilledButton from '@/components/FilledButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useUsersStore } from '@/store/users';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const { getUsers } = storeToRefs(usersStore);

const route = useRoute();
const user = computed(() => getUsers.value.find(u => u.id == route.params.id));
</script>

<template>
    <MainHeader title="User Details">
        <RouterLink to="/admin">
            <FilledButton>
                <icon icon="material-symbols:edit" /> Edit details
            </FilledButton>
        </RouterLink>
    </MainHeader>


    <section class="grid bg-white p-4 rounded-md">
        <pre>{{ user }}</pre>
    </section>
</template>