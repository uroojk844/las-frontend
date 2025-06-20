<script setup>
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

const feeDetails = reactive({
    payment_mode: 'cash',
    fee_type_id: [],
    fee_data: [],
});

const fee_type_id_list = reactive({})

const feeOptions = computed(() => getFeeTypes.value.map(fee => {
    return {
        'label': `${fee.name} fee`,
        'value': fee.id,
    };
}));

watch(getFeeDetails, () => {
    if (!getFeeDetails.value) return;
    feeDetails.fee_data = JSON.parse(getFeeDetails.value.fee_data)
    feeDetails.fee_data.map((d) => {
        fee_type_id_list[d.id] = {
            id: d.id,
            amount_paid: +d.amount,
            name: `${d.name} fee`,
            amount_to_pay: +d.amount,
            balance_fee: 0,
            balance_transport_fee: 0,
        };
    })
    feeDetails.fee_type_id = JSON.parse(getFeeDetails.value.fee_type_id);

    if (getFeeDetails.value.transport_fee > 0) {

        fee_type_id_list[10] = {
            id: 10,
            amount_paid: +getFeeDetails.value.transport_fee,
            name: `transport fee`,
            amount_to_pay: +getFeeDetails.value.transport_fee,
            balance_fee: 0,
            balance_transport_fee: 0,
        }
        feeDetails.fee_type_id.push(10);
    }
});

const discount = ref(0)
const totalAmount = computed(() => feeDetails.fee_type_id.reduce((acc, cur) => +fee_type_id_list[cur].amount_to_pay + acc, 0));
const amountPaid = computed(() => feeDetails.fee_type_id.reduce((acc, cur) => +fee_type_id_list[cur].amount_paid + acc, 0));
const totalBalace = computed(() => feeDetails.fee_type_id.reduce((acc, cur) => +fee_type_id_list[cur].balance_fee + acc, 0));
const discountAmount = computed(() => +amountPaid.value * (+discount.value / 100));

function updateBalace(event, id) {
    let fee = fee_type_id_list[id];

    switch (event.target.name) {
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
    <MainHeader title="Search student details">
        <InputField type="date" v-model="today" />
    </MainHeader>
    <section class="bg-white p-4 rounded-md grid gap-4 mb-4">
        <form @submit.prevent="feeStore.searchFeeDetails" class="flex items-end gap-4">
            <InputField label="Enrollment number" name="enrollment" v-model="enrollment"
                placeholder="Enter 8 digit enrollment" />
            <FilledButton :isLoading="getIsSearchingFeeDetail">Search student</FilledButton>
        </form>

    </section>

    <div v-if="getFeeDetails" class="contents">
        <section class="bg-white p-4 rounded-md grid-responsive">
            <InputField label="Name" v-model="getFeeDetails.full_name" disabled :required="false" />
            <InputField label="Phone" v-model="getFeeDetails.phone" disabled :required="false" />
            <InputField label="Class" v-model="getFeeDetails.joiningClass" disabled :required="false" />
            <InputField label="Transport distance (Km)" v-model="getFeeDetails.distance" disabled :required="false" />
        </section>
        <MainHeader title="Enter fee details" class="mt-4" />
        <section class="bg-white p-4 rounded-md grid gap-4">
            <form @submit.prevent="feeStore.submitFee($event, feeDetails.fee_type_id, fee_type_id_list)"
                class="grid-responsive">
                <input type="hidden" name="collected_by" :value="getUser.id" required />
                <input type="hidden" name="student_id" :value="getFeeDetails.student_id" required />

                <InputField type="number" label="Total amount to pay" v-model="totalAmount" disabled />
                <InputField type="number" label="Discount %" max="100" name="discount" v-model="discount"
                    :required="false" />
                <InputField label="Transaction ID" name="transaction_id"
                    :required="feeDetails.payment_mode != 'cash'" />
                <InputField label="Select date" name="payment_date" type="date" v-model="today" />
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
                    :options="feeOptions" />

                <div class="flex gap-4 col-span-full" v-for="(id, index) in feeDetails.fee_type_id" :key="index">
                    <InputField type="number" min="0" :max="fee_type_id_list[id].amount_to_pay"
                        :label="fee_type_id_list[id].name" v-model="fee_type_id_list[id].amount_paid" name="amount_paid"
                        @input="updateBalace($event, id)" />
                    <InputField type="number" min="0" :max="fee_type_id_list[id].amount_to_pay"
                        :label="`Balance ${fee_type_id_list[id].name}`" v-model="fee_type_id_list[id].balance_fee"
                        name="balance_fee" @input="updateBalace($event, id)" :required="false" />
                </div>

                <!-- <div v-if="fee_type_id_list[9].amount_paid" class="flex gap-4 col-span-full">
                    <InputField type="number" label="Transport fee" v-model="fee_type_id_list[9].amount_paid" />
                    <InputField type="number" label="Balance transport fee" v-model="fee_type_id_list[9].balance_fee"
                        :required="false" />
                </div> -->

                <div class="col-span-full">
                    <TextField label="Notes" :rows="2" name="notes" :required="false"></TextField>
                </div>

                <hr class="col-span-full border-dashed h-1 border-gray-200" />

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

                <hr class="col-span-full border-dashed h-1 border-gray-200" />

                <div class="col-span-full">
                    <FilledButton :isLoading="getIsSubmittingFee">Submit</FilledButton>
                </div>
            </form>
        </section>
    </div>
</template>