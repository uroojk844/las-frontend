<script setup>
import FilledButton from '@/components/FilledButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import useUserStore from "@/store/user";
import { useStudentsStore } from "@/store/students";
import { storeToRefs } from 'pinia';
import TableAdaptor from '@/components/TableAdaptor.vue';

const URL = import.meta.env.API_URL || "https://lasms.proficiosoftware.com";

const studentsStore = useStudentsStore();
const { getStudents } = storeToRefs(studentsStore);

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
        <TableAdaptor title="Students information"
            :headers="['Student', 'Enrollment number', 'Class', 'Balance fee', 'DOB', 'Mobile', 'Address']"
            :data="getStudents" filterBy="joiningClass">
            <template #default="{ data }">
                <tr v-for="(student, index) in data" :key="index" class="hover:bg-background cursor-pointer"
                    @click="() => $router.push('/student/view/' + student.id)" title="Click to view details">
                    <td class="flex items-center gap-2 cursor-pointer">
                        <img class="size-8 rounded-full" :src="`${URL}/documents/${student.id}/${student?.photo}`"
                            :alt="student.full_name">
                        {{ student.full_name }}
                    </td>
                    <td>{{ student.enrollment }}</td>
                    <td>{{ student.joiningClass }}</td>
                    <td>{{ student.balance_fee }}</td>
                    <td>{{ student.dob }}</td>
                    <td>{{ student.phone }}</td>
                    <td>{{ student.address }}</td>
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