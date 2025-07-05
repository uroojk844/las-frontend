<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue"
import MainHeader from "@/components/MainHeader.vue"
import InputField from "@/components/InputField.vue"
import FilledButton from "@/components/FilledButton.vue"
import CheckBoxGroup from "@/components/CheckBoxGroup.vue";
import TextField from "@/components/TextField.vue";
import RadioGroup from "@/components/RadioGroup.vue";
import useUserStore from "@/store/user";
import { storeToRefs } from "pinia";
import { useFeeStore } from "@/store/fee";
import { today } from "@/utils/date";
const userStore = useUserStore()
const { getUser } = storeToRefs(userStore);

const feeStore = useFeeStore();
const { enrollment, getIsSubmittingFee, getIsSearchingFeeDetail, getFeeDetails, getFeeTypes } = storeToRefs(feeStore);

const monthOptions = [
    {
        label: 'apr',
        value: 'apr',
    },
    {
        label: 'may',
        value: 'may',
    },
    {
        label: 'jun',
        value: 'jun',
    },
    {
        label: 'jul',
        value: 'jul',
    },
    {
        label: 'aug',
        value: 'aug',
    },
    {
        label: 'sep',
        value: 'sep',
    },
    {
        label: 'oct',
        value: 'oct',
    },
    {
        label: 'nov',
        value: 'nov',
    },
    {
        label: 'dec',
        value: 'dec',
    },
    {
        label: 'jan',
        value: 'jan',
    },
    {
        label: 'feb',
        value: 'feb',
    },
    {
        label: 'mar',
        value: 'mar',
    },
];

let feeDetails = reactive<{
    payment_mode: 'cash' | 'bank' | 'upi',
    fee_type_id: number[],
    fee_data: IFeeData[],
    months: string[],
    paidMonths: string[],
}>({
    payment_mode: 'cash',
    fee_type_id: [],
    fee_data: [],
    months: [],
    paidMonths: [],
});

interface IFeeData {
    id: number,
    amount: number,
    name: string,
}

interface TFeeTypeIDList {
    id: number,
    amount_paid: number,
    name: string,
    amount_to_pay: number,
    balance_fee: number,
    balance_transport_fee: number,
}

const fee_type_id_list = reactive<Record<number, TFeeTypeIDList>>({})

const feeOptions = computed(() => getFeeTypes.value.map(fee => {
    return {
        'label': `${fee.name} fee`,
        'value': fee.id,
    };
}));

function calcFee(fee: IFeeData) {
    let amount = 0;
    const totalMonths = feeDetails.months.length;

    switch (fee.id) {
        case 2:
            amount = fee.amount * Math.round((totalMonths + feeDetails.paidMonths.length) / 6);
            break;
        case 5:
            amount = fee.amount;
            break;
        default:
            amount = fee.amount * totalMonths
            break;
    }

    return amount;
}

watch([getFeeDetails, () => feeDetails.months], ([newValue, _]) => {
    if (!getFeeDetails.value || !newValue) return;

    try {
        let fee_data = JSON.parse(newValue.fee_data) as IFeeData[];
        let fee_type_id = JSON.parse(newValue.fee_type_id) as number[];
        let parsedMonth = newValue.months ? (JSON.parse(newValue.months) as string[]).map((m) => JSON.parse(m)).flat() : [];

        feeDetails.fee_data = fee_data;
        feeDetails.fee_type_id = fee_type_id;
        feeDetails.paidMonths = [...new Set(parsedMonth)];

        const totalMonths = feeDetails.months.length;

        feeDetails.fee_data.map((d) => {
            fee_type_id_list[d.id] = {
                id: d.id,
                amount_paid: calcFee(d),
                name: `${d.name} fee`,
                amount_to_pay: calcFee(d),
                balance_fee: 0,
                balance_transport_fee: 0,
            };
        });

        if (getFeeDetails.value.transport_fee > 0) {
            fee_type_id_list[10] = {
                id: 10,
                amount_paid: +getFeeDetails.value.transport_fee * totalMonths,
                name: `transport fee`,
                amount_to_pay: +getFeeDetails.value.transport_fee * totalMonths,
                balance_fee: 0,
                balance_transport_fee: 0,
            }
            feeDetails.fee_type_id.push(10);
        }

        feeDetails.months.map((m, idx) => {
            if (feeDetails.paidMonths.includes(m)) {
                feeDetails.months.splice(idx, 1);
            }
        });

        if (!newValue?.admission) {
            feeDetails.fee_type_id.push(5);
        }

    } catch (error) {
        console.error("Error parsing feeDetails JSON:", error);
    }
});

const discount = ref(0)
const totalAmount = computed(() => feeDetails.fee_type_id.reduce((acc, cur) => +fee_type_id_list[cur].amount_to_pay + acc, 0));
const amountPaid = computed(() => feeDetails.fee_type_id.reduce((acc, cur) => +fee_type_id_list[cur].amount_paid + acc, 0));
const totalBalace = computed(() => feeDetails.fee_type_id.reduce((acc, cur) => +fee_type_id_list[cur].balance_fee + acc, 0));
const discountAmount = computed(() => {
    if (!fee_type_id_list[1].amount_to_pay) return 0;

    return +fee_type_id_list[1].amount_to_pay * (+discount.value / 100)
});

function updateBalace(event: Event, id: number) {
    let fee = fee_type_id_list[id];

    switch ((event.target as HTMLInputElement).name) {
        case 'amount_paid':
            fee.balance_fee = fee.amount_to_pay - fee.amount_paid;
            break;
        case 'balance_fee':
            fee.amount_paid = fee.amount_to_pay - fee.balance_fee;
            break;
        default:
            break;
    }
}
</script>

<template>
    <MainHeader title="Search student details" />
    <section class="bg-surface p-4 rounded-md grid gap-4 mb-4">
        <form @submit.prevent="feeStore.searchFeeDetails" class="flex items-end gap-4">
            <InputField label="Enrollment number" name="enrollment" v-model="enrollment"
                placeholder="Enter 8 digit enrollment" />
            <FilledButton :isLoading="getIsSearchingFeeDetail">Search student</FilledButton>
        </form>
    </section>

    <div v-if="getFeeDetails" class="contents">
        <section class="bg-surface p-4 rounded-md grid-responsive">
            <InputField label="Name" v-model="getFeeDetails.full_name" disabled :required="false" />
            <InputField label="Phone" v-model="getFeeDetails.phone" disabled :required="false" />
            <InputField label="Class" v-model="getFeeDetails.joiningClass" disabled :required="false" />
            <InputField label="Transport distance (Km)" v-model="getFeeDetails.distance" disabled :required="false" />
        </section>

        <MainHeader title="Enter fee details" class="mt-4" />

        <section class="bg-surface p-4 rounded-md grid gap-4">
            <form
                @submit.prevent="feeStore.submitFee($event, feeDetails.fee_type_id, fee_type_id_list, feeDetails.months)"
                class="grid-responsive">
                <input type="hidden" name="enrollment" v-model="enrollment" required />
                <input type="hidden" name="collected_by" :value="getUser?.id" required />
                <input type="hidden" name="student_id" :value="getFeeDetails.student_id" required />

                <CheckBoxGroup class="col-span-full" label="Select month(s)" v-model="feeDetails.months"
                    :options="monthOptions" :disabledFields="feeDetails.paidMonths" />

                <InputField type="number" label="Total amount to pay" v-model="totalAmount" disabled />
                <InputField type="number" label="Discount %" max="100" name="discount" v-model="discount"
                    :required="false" />
                <InputField label="Transaction ID" name="transaction_id"
                    :required="feeDetails.payment_mode != 'cash'" />
                <InputField label="Payment date" name="payment_date" type="date" v-model="today" />
                <RadioGroup label="Payment mode" name="payment_method" class="col-span-full"
                    v-model="feeDetails.payment_mode" :values="[
                        {
                            label: 'Cash',
                            value: 'cash',
                        },
                        {
                            label: 'Bank transfer',
                            value: 'bank',
                        },
                        {
                            label: 'UPI',
                            value: 'upi',
                        },
                    ]" />

                <CheckBoxGroup class="col-span-full" label="Check fee to pay" v-model="feeDetails.fee_type_id"
                    :options="feeOptions"
                    :disabledFields="[getFeeDetails?.admission ? getFeeDetails.admission.toString() : '']" />

                <div class="flex gap-4 col-span-full" v-for="(id, index) in feeDetails.fee_type_id" :key="index">
                    <InputField type="number" min="0" :max="fee_type_id_list[id].amount_to_pay"
                        :label="fee_type_id_list[id].name" v-model="fee_type_id_list[id].amount_paid" name="amount_paid"
                        @input="updateBalace($event, id)" />
                    <InputField type="number" min="0" :max="fee_type_id_list[id].amount_to_pay"
                        :label="`Balance ${fee_type_id_list[id].name}`" v-model="fee_type_id_list[id].balance_fee"
                        name="balance_fee" @input="updateBalace($event, id)" :required="false" />
                </div>

                <div class="col-span-full">
                    <TextField label="Notes" :rows="2" name="notes" :required="false"></TextField>
                </div>

                <hr class="col-span-full border-dashed h-1 border-border" />

                <div class="space-y-1 col-span-2 col-start-2">
                    <p class="flex justify-between items-center w-full">
                        <span>Sub total</span>
                        <span class="flex items-center">
                            <icon icon="material-symbols:currency-rupee" /> {{ totalAmount }}
                        </span>
                    </p>
                    <p class="flex justify-between items-center w-full">
                        <span>Discount</span>
                        <span class="flex items-center">
                            <icon icon="material-symbols:currency-rupee" /> {{ discountAmount }}
                        </span>
                    </p>
                    <p class="flex justify-between items-center w-full">
                        <span>Balance</span>
                        <span class="flex items-center">
                            <icon icon="material-symbols:currency-rupee" /> {{ totalBalace }}
                        </span>
                    </p>
                    <p class="flex justify-between items-center w-full text-xl font-bold">
                        <span>Total amount to pay</span>
                        <span class="flex items-center">
                            <icon icon="material-symbols:currency-rupee" /> {{ amountPaid - discountAmount }}
                        </span>
                    </p>
                </div>

                <hr class="col-span-full border-dashed h-1 border-border" />

                <div class="col-span-full">
                    <FilledButton :isLoading="getIsSubmittingFee" :disabled="!totalAmount">Submit</FilledButton>
                </div>
            </form>
        </section>
    </div>
</template>