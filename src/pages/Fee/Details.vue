<script setup>
import { ref } from "vue"
import MainHeader from "@/components/MainHeader.vue"
import InputField from "@/components/InputField.vue"
import FilledButton from "@/components/FilledButton.vue"
import TableAdaptor from "@/components/TableAdaptor.vue";
import Avatar from "@/components/Avatar.vue";
import { useStudentsStore } from "@/store/students";
import { storeToRefs } from "pinia";
import { today } from "@/utils/date";
import { RouterLink } from "vue-router";

const enrollment = ref('');
const studentsStore = useStudentsStore();
const { getIsSearching, getStudent } = storeToRefs(studentsStore);
</script>

<template>
    <MainHeader title="Fee details">
        <InputField type="date" disable v-model="today" />
    </MainHeader>

    <section class="bg-white p-4 rounded-md grid gap-4 mb-4">
        <div class="flex items-end justify-between">
            <form @submit.prevent="studentsStore.searchStudent(enrollment)" class="flex items-end gap-4">
                <InputField label="Enrollment number" v-model="enrollment" placeholder="Enter 8 digit enrollment" />
                <FilledButton :isLoading="getIsSearching">Search student</FilledButton>
            </form>
            <RouterLink to="/fee">
                <FilledButton>Submit Fee</FilledButton>
            </RouterLink>
        </div>
    </section>

    <section class="bg-white p-4 rounded-md grid gap-4">
        <TableAdaptor title="Previous fee details"
            :headers="['Name', 'Fee type', 'Amount', 'Balance', 'Date', 'Payment method', 'Receipt number', 'Collected by', 'Notes']"
            :data="getStudent" filterBy="fee_type" message="Search student to see previous fee details" :loading="getIsSearching">
            <template #default="{ data }">
                <tr v-for="(user, index) in data" :key="index" class="hover:bg-background cursor-pointer"
                    @click="() => $router.push('/admin/view/' + user.student_id)" title="Click to view details">
                    <td class="flex items-center gap-2 cursor-pointer min-w-32">
                        <Avatar :id="user.student_id" :photo="user.photo" />
                        <span class="flex-1">{{ user.full_name }}</span>
                    </td>
                    <td class="capitalize">{{ user.fee_type }}</td>
                    <td>{{ user.amount_paid }}</td>
                    <td>{{ user.balance_fee }}</td>
                    <td>{{ user.payment_date }}</td>
                    <td>{{ user.payment_method }}</td>
                    <td>{{ user.receipt_number }}</td>
                    <td>{{ user.collected_by }}</td>
                    <td>{{ user.notes }}</td>
                </tr>
            </template>
        </TableAdaptor>
    </section>
</template>