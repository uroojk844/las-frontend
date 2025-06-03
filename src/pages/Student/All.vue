<script setup>
import FilledButton from '@/components/FilledButton.vue';
import { RouterLink } from 'vue-router';
import students from '@/assets/students.json';
import { computed, ref } from 'vue';

const filter = ref('');

const filteredStudents = computed(() => students.filter(student => {
    return student.name.toLowerCase().includes(filter.value.toLowerCase()) ||
        student.roll.toString().includes(filter.value);
}));
</script>

<template>
    <section class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Students List</h1>
        <RouterLink to="/students/add">
            <FilledButton>
                <icon icon="ph:plus-bold" /> Add Student
            </FilledButton>
        </RouterLink>
    </section>

    <section class="grid bg-white p-4 rounded-md">
        <div class="flex items-center mb-4">
            <h1 class="text-xl font-medium mr-auto">Students information</h1>
            <div
                class="max-sm:hidden flex items-center gap-2 bg-background h-8 rounded overflow-hidden max-w-64 w-full">
                <input type="search" v-model="filter" placeholder="Search by name or roll" class="h-full pl-2 w-full" />
                <icon icon="ph:magnifying-glass-bold" />
            </div>
        </div>

        <div v-if="filteredStudents.length" class="overflow-x-auto">
            <table class="table table-auto w-full rounded-md overflow-hidden whitespace-nowrap">
                <thead>
                    <tr class="bg-secondary text-light-gray font-medium">
                        <td>Student</td>
                        <td>Roll number</td>
                        <td>Class</td>
                        <td>DOB</td>
                        <td>Mobile</td>
                        <td>Address</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, index) in filteredStudents" :key="index"
                        class="hover:bg-background cursor-pointer"
                        @click="() => $router.push('/students/view/' + student.roll)"
                        title="Click to view details">
                        <td class="flex items-center gap-2 cursor-pointer">
                            <img class="size-8 rounded-full" :src="'https://picsum.photos/30.webp?random=' + index"
                                :alt="student.name">
                            {{ student.name }}
                        </td>
                        <td>{{ student.roll }}</td>
                        <td>{{ student.class }}</td>
                        <td>{{ student.dob }}</td>
                        <td>{{ student.mobile }}</td>
                        <td>{{ student.address }}</td>
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