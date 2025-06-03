<script setup>
import FilledButton from '@/components/FilledButton.vue';
import students from '@/assets/students.json';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const student = computed(() => students.find(s => s.roll === route.params.id));
</script>

<template>
    <section class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Student details</h1>
        <RouterLink to="/students">
            <FilledButton>
                <icon icon="material-symbols:edit" /> Edit details
            </FilledButton>
        </RouterLink>
    </section>


    <section class="grid bg-white p-4 rounded-md">
        <pre>{{ student }}</pre>
    </section>
</template>