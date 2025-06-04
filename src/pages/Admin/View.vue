<script setup>
import FilledButton from '@/components/FilledButton.vue';
import users from '@/assets/users.json';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const user = computed(() => users.find(u => u.id === route.params.id));
</script>

<template>
    <section class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">User details</h1>
        <RouterLink to="/admin">
            <FilledButton>
                <icon icon="material-symbols:edit" /> Edit details
            </FilledButton>
        </RouterLink>
    </section>


    <section class="grid bg-white p-4 rounded-md">
        <pre>{{ user }}</pre>
    </section>
</template>