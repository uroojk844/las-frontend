<script setup>
import FilledButton from '@/components/FilledButton.vue';
import students from '@/assets/students.json';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import useUserStore from '@/store/user';

const route = useRoute();
const student = computed(() => students.find(s => s.roll === route.params.id));

const userStore = useUserStore();
</script>

<template>
    <section class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Student details</h1>
        <RouterLink to="/students" v-if="userStore.getIsAdmin">
            <FilledButton>
                <icon icon="material-symbols:edit" /> Edit details
            </FilledButton>
        </RouterLink>
    </section>


    <section class="grid bg-white p-4 rounded-md">
        <pre>{{ student }}</pre>
    </section>
</template>