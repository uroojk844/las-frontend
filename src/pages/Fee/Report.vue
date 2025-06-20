<script setup>
import MainHeader from "@/components/MainHeader.vue"
import InputField from "@/components/InputField.vue"
import FilledButton from "@/components/FilledButton.vue"
import TableAdaptor from "@/components/TableAdaptor.vue";
import SelectField from "@/components/SelectField.vue";
import Avatar from "@/components/Avatar.vue";
import { computed, onMounted, ref } from "vue"
import { useFeeStore } from "@/store/fee";
import { storeToRefs } from "pinia";
import { today } from "@/utils/date";
import { useStudentsStore } from "@/store/students";

const feeStore = useFeeStore();
const { getIsSearching, getStudentList } = storeToRefs(feeStore);

const studentsStore = useStudentsStore();
const { classListOption } = storeToRefs(studentsStore);

const joiningClass = ref('')


const excelData = computed(() => {
    if (!getStudentList.value.length) return;
    let studentList = JSON.parse(JSON.stringify(getStudentList.value));

    return studentList.map(student => {
        delete student['id'];
        JSON.parse(student['balance_fee']).map(fee => {
            student[`${fee.name} fee`] = fee.amount;
        })
        delete student['balance_fee'];
        return student;
    })
});

onMounted(() => {
    studentsStore.fetchClassList();
})
</script>

<template>
    <MainHeader title="Generate balance fee report">
        <InputField type="date" disable v-model="today" />
    </MainHeader>

    <section class="bg-white p-4 rounded-md grid gap-4 mb-4">
        <form @submit.prevent="feeStore.fetchReport" class="flex items-end gap-4">
            <SelectField label="Select Class" name="joiningClass" v-model="joiningClass" position="bottom"
                :options="classListOption" />
            <FilledButton :isLoading="getIsSearching">Search</FilledButton>
        </form>
    </section>

    <section class="bg-white p-4 rounded-md grid gap-4">
        <TableAdaptor title="Previous fee details"
            :headers="['Name', 'Balance Amount', 'Father name', 'Phone', 'Address', 'Collected by', 'Notes']"
            :data="getStudentList" message="Search student to see previous fee details" :loading="getIsSearching">
            <template #extensions>
                <download-excel title="Click to download Excel sheet." :data="excelData" class="cursor-pointer"
                    :name="`Class ${joiningClass} Fee Report.xls`">
                    <icon icon="file-icons:microsoft-excel" class="text-xl" />
                </download-excel>
            </template>
            <template #default="{ data }">
                <tr v-for="(user, index) in data" :key="index" class="hover:bg-background cursor-pointer">
                    <td class="flex items-center gap-2 cursor-pointer min-w-32">
                        <Avatar :id="user.id" :photo="user.photo" />
                        <span class="flex-1">{{ user.full_name }}</span>
                    </td>
                    <td class="text-sm">
                        <ul>
                            <li class="flex justify-between gap-2" v-for="(item, index) in JSON.parse(user.balance_fee)"
                                :key="index">
                                <span class="capitalize">{{ item.name }}:</span>
                                <span class="flex items-center">
                                    <icon icon="mdi:currency-rupee" /> {{ item.amount }}
                                </span>
                            </li>
                        </ul>
                        <hr class="my-1" />
                        <div class="flex justify-between gap-2">
                            <span class="capitalize">Total:</span>
                            <span class="flex items-center">
                                <icon icon="mdi:currency-rupee" />
                                {{JSON.parse(user.balance_fee).reduce((acc, cur) => +cur.amount + acc, 0)}}
                            </span>
                        </div>
                    </td>
                    <td>{{ user.fatherName }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.address }}</td>
                    <td>{{ user.collected_by }}</td>
                    <td>{{ user.notes }}</td>
                </tr>
            </template>
        </TableAdaptor>
    </section>
</template>