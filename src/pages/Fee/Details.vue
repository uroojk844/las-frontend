<script setup lang="ts">
import { computed, ref } from "vue"
import MainHeader from "@/components/MainHeader.vue"
import InputField from "@/components/InputField.vue"
import FilledButton from "@/components/FilledButton.vue"
import TableAdaptor from "@/components/TableAdaptor.vue";
import Avatar from "@/components/Avatar.vue";
import { useStudentsStore } from "@/store/students";
import { storeToRefs } from "pinia";
import { today } from "@/utils/date";
import { RouterLink } from "vue-router";
import moment from "moment";
import Model from "@/components/Model.vue";
import { IFeeDetails } from "@/store/students.interface";
import RadioGroup from "@/components/RadioGroup.vue";
import { useFeeStore } from "@/store/fee";
import useUserStore from "@/store/user";

const studentsStore = useStudentsStore();
const { getIsSearching, getStudentFeeDetail } = storeToRefs(studentsStore);

const userStore = useUserStore();
const { getUser } = storeToRefs(userStore);

const feeStore = useFeeStore();
const { getIsPayingBalance } = storeToRefs(feeStore);

const filters = ref<('balance' | 'all')[]>(['all'])

const filteredData = computed(() => {
    let data = [];
    if (filters.value.includes("all")) {
        data = getStudentFeeDetail.value;
    } else {
        data = getStudentFeeDetail.value.filter(s => moment(s.payment_date).isSame(moment(), 'day'))
    }

    if (filters.value.includes("balance")) {
        return data.filter(s => s.balance_fee > 0);
    }
    return data;
});

const isOpen = ref(false);
const selectedFee = ref<IFeeDetails>({
    payment_id: 0,
    amount_paid: 0,
    month: '',
    balance_fee: 0,
    collected_by: "",
    photo: "",
    fee_type: "",
    full_name: "",
    notes: "",
    payment_date: "",
    payment_method: "",
    receipt_number: "",
    student_id: "",
});

function setSelectedFee(fee: IFeeDetails) {
    selectedFee.value = fee;
    isOpen.value = true;
}

function payBalance(event: Event) {
    feeStore.payBalance(event);
    isOpen.value = false;
}
</script>

<template>
    <MainHeader title="Fee details">
        <InputField type="date" disable v-model="today" />
    </MainHeader>

    <section class="bg-surface p-4 rounded-md grid gap-4 mb-4">
        <div class="flex items-end justify-between">
            <form @submit.prevent="studentsStore.searchStudent" class="flex items-end gap-4">
                <InputField label="Enrollment number" name="enrollment" placeholder="Enter 8 digit enrollment" />
                <FilledButton :isLoading="getIsSearching">Search student</FilledButton>
            </form>
            <RouterLink v-if="userStore.getRole == 'super' || userStore.getRole == 'admin'" to="/fee">
                <FilledButton>Submit Fee</FilledButton>
            </RouterLink>
        </div>
    </section>

    <section class="bg-surface p-4 rounded-md grid gap-4">
        <TableAdaptor title="Previous fee details"
            :headers="['Name', 'Fee type', 'Amount', 'Balance', 'Month', 'Date', 'Payment method', 'Receipt number', 'Collected by', 'Notes']"
            :data="filteredData || []" filterBy="fee_type" message="Search student to see previous fee details"
            :loading="getIsSearching">
            <template #extensions>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label for="showBalance2" class="text-sm select-none">All fee</label>
                        <input type="checkbox" id="showBalance2" value="all" v-model="filters" name="filter" />
                    </div>

                    <div class="flex items-center gap-2">
                        <label for="showBalance" class="text-sm select-none">Balance fee</label>
                        <input type="checkbox" id="showBalance" value="balance" v-model="filters" name="filter" />
                    </div>
                </div>
            </template>
            <template #default="{ data }">
                <tr v-for="(user, index) in data" :key="index" class="hover:bg-background cursor-pointer"
                    @click="setSelectedFee(user)" title="Click to pay balance fee">
                    <td class="flex items-center gap-2 cursor-pointer min-w-32">
                        <Avatar :id="user.student_id" :photo="user.photo" />
                        <span class="flex-1">{{ user.full_name }}</span>
                    </td>
                    <td class="capitalize">{{ user.fee_type }}</td>
                    <td>{{ user.amount_paid }}</td>
                    <td>{{ user.balance_fee }}</td>
                    <td class="capitalize">{{JSON.parse(user.month).map((m: string) => m).join(",")}}</td>
                    <td>{{ user.payment_date }}</td>
                    <td>{{ user.payment_method }}</td>
                    <td>{{ user.receipt_number }}</td>
                    <td>{{ user.collected_by }}</td>
                    <td>{{ user.notes }}</td>
                </tr>
            </template>
        </TableAdaptor>
    </section>

    <Model v-model="isOpen">
        <MainHeader title="Balance fee details" />

        <form @submit.prevent="payBalance" class="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="collected_by" :value="getUser?.id" />
            <input type="hidden" name="payment_id" :value="selectedFee.payment_id" />
            <InputField label="Student name" v-model="selectedFee.full_name" disabled />
            <InputField label="Fee" class="capitalize" v-model="selectedFee.fee_type" disabled />
            <InputField label="Balance Amount" name="amount_paid" v-model="selectedFee.balance_fee" />
            <InputField label="Receipt number" v-model="selectedFee.receipt_number" disabled />
            <RadioGroup label="Payment method" name="payment_method" :values="[
                {
                    label: 'Cash',
                    value: 'cash'
                },
                {
                    label: 'UPI',
                    value: 'upi'
                },
                {
                    label: 'Bank',
                    value: 'bank'
                },
            ]" v-model="selectedFee.payment_method" />
            <InputField label="Transaction number" name="transaction_id" v-model="selectedFee.transaction_id"
                :required="selectedFee.payment_method != 'cash'" />

            <div>
                <FilledButton :is-loading="getIsPayingBalance">Pay now</FilledButton>
            </div>
        </form>

    </Model>
</template>