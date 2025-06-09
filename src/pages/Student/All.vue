<script setup>
import FilledButton from '@/components/FilledButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import { RouterLink } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import useUserStore from "@/store/user";
import { useStudentsStore } from "@/store/students";
import { storeToRefs } from 'pinia';

const URL = import.meta.env.API_URL || "https://lasms.proficiosoftware.com";

const studentsStore = useStudentsStore();
const { getStudents } = storeToRefs(studentsStore);
const filter = ref('');

const filteredStudents = computed(() => getStudents.value.filter(student => {
    let fullname = `${student.firstName} ${student.middleName} ${student.lastName}`;
    return fullname.toLowerCase().includes(filter.value.toLowerCase()) ||
        student?.roll?.toString().includes(filter.value);
}));

const userStore = useUserStore();

onMounted(() => {
    studentsStore.fetchStudents();
})
</script>

<template>
    <MainHeader title="Students List">
        <RouterLink to="/student/add">
            <FilledButton v-if="userStore.getIsAdmin">
                <icon icon="ph:plus-bold" /> Add Student
            </FilledButton>
        </RouterLink>
    </MainHeader>

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
                        @click="() => $router.push('/student/view/' + student.id)" title="Click to view details">
                        <td class="flex items-center gap-2 cursor-pointer">
                            <img class="size-8 rounded-full" :src="`${URL}/documents/${student.id}/${student?.photo}`"
                                :alt="student.name">
                            {{ student.firstName }} {{ student.middleName }} {{ student.lastName }}
                        </td>
                        <td>{{ student.roll }}</td>
                        <td>{{ student.joiningClass }}</td>
                        <td>{{ student.dob }}</td>
                        <td>{{ student.phone }}</td>
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