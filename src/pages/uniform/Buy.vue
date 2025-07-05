<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue"
import MainHeader from "@/components/MainHeader.vue"
import InputField from "@/components/InputField.vue"
import FilledButton from "@/components/FilledButton.vue"
import TextField from "@/components/TextField.vue";
import RadioGroup from "@/components/RadioGroup.vue";
import TableAdaptor from "@/components/TableAdaptor.vue";

import { today } from "@/utils/date";
import useUserStore from "@/store/user";
import { storeToRefs } from "pinia";
import SelectField from "@/components/SelectField.vue";
import { useUniformStore } from "@/store/uniform.store";

const userStore = useUserStore();
const { getUser } = storeToRefs(userStore);

const uniformStore = useUniformStore();
const { getIsLoadingUniform, getSizeOptions, getUniforms, getIsLoadingDetails, getBuyDetail, getIsSubmittingUniformFee } = storeToRefs(uniformStore);

const size = ref<number>(0);

const filtredData = computed(() => getUniforms.value.filter(u => u.size_id == size.value && u.gender == getBuyDetail.value?.gender));

const feeDetails = reactive({
    payment_mode: 'cash',
    amount_paid: 0,
    balance_fee: 0,
})

const discount = ref(0)
const totalAmount = computed(() => filtredData.value.reduce((acc, cur) => cur.selling_price + acc, 0));
const discountAmount = computed(() => Math.round(+feeDetails.amount_paid * (+discount.value / 100)));

watch(getUniforms, () => {
    feeDetails.amount_paid = totalAmount.value;
})

function updateBalace(event: Event) {
    switch ((event.target as HTMLInputElement).name) {
        case 'amount_paid':
            feeDetails.balance_fee = totalAmount.value - feeDetails.amount_paid;
            break;
        case 'balance_fee':
            feeDetails.amount_paid = totalAmount.value - feeDetails.balance_fee;
            break;
        default:
            break;
    }
}

function submitBookFee(event: Event) {
    let fee_data = {
        fee_type_id: 11,
        amount_paid: feeDetails.amount_paid,
        balance_fee: feeDetails.balance_fee,
    };
    uniformStore.submitUniformFee(event, fee_data);
}

onMounted(() => {
    uniformStore.fetchUniformList();
})
</script>

<template>
    <MainHeader title="Buy uniform">
        <InputField type="date" v-model="today" />
    </MainHeader>

    <section class="bg-surface p-4 rounded-md mb-4">
        <form @submit.prevent="uniformStore.fetchBuyDetails" class="flex items-end gap-4">
            <InputField label="Enrollment number" name="enrollment" placeholder="Enter 8 digit enrollment" />
            <SelectField label="Size" v-model="size" :options="getSizeOptions" position="bottom" />
            <FilledButton :isLoading="getIsLoadingDetails">Search uniform</FilledButton>
        </form>
    </section>

    <div v-if="getBuyDetail" class="contents">
        <section class="bg-surface p-4 rounded-md">
            <TableAdaptor title="Uniform list" :headers="['Name', 'Size', 'Gender', 'Selling Price', 'Action']"
                :data="filtredData" filterBy="gender" :loading="getIsLoadingUniform">
                <template #default="{ data }">
                    <tr v-for="(uniform, index) in data" :key="index" class="hover:bg-background cursor-pointer">
                        <td>{{ uniform.name }}</td>
                        <td>{{ uniform.size }}</td>
                        <td class="capitalize">{{ uniform.gender }}</td>
                        <td>{{ uniform.selling_price }}</td>
                        <td class="max-w-16">
                            <FilledButton @click="uniformStore.removeUniform(uniform.id)" type="danger" size="sm">
                                <icon icon="ph:trash-bold" /> Delete
                            </FilledButton>
                        </td>
                    </tr>
                </template>
            </TableAdaptor>
        </section>

        <MainHeader title="Enter payment details" class="mt-4" />
        <section class="bg-surface p-4 rounded-md grid gap-4">
            <form @submit.prevent="submitBookFee" class="grid-responsive">
                <input type="hidden" name="collected_by" :value="getUser?.id" required />
                <input type="hidden" name="student_id" :value="getBuyDetail?.student_id" required />

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


                <div class="flex gap-4 col-span-full">
                    <InputField type="number" label="Amount paid" name="amount_paid" v-model="feeDetails.amount_paid"
                        @input="updateBalace" />
                    <InputField type="number" label="Balance amount" name="balance_fee" v-model="feeDetails.balance_fee"
                        @input="updateBalace" :required="false" />
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
                            <icon icon="material-symbols:currency-rupee" /> {{ feeDetails.balance_fee }}
                        </span>
                    </p>
                    <p class="flex justify-between items-center w-full text-xl font-bold">
                        <span>Total amount to pay</span>
                        <span class="flex items-center">
                            <icon icon="material-symbols:currency-rupee" /> {{ feeDetails.amount_paid - discountAmount
                            }}
                        </span>
                    </p>
                </div>

                <hr class="col-span-full border-dashed h-1 border-border" />

                <div class="col-span-full">
                    <FilledButton :isLoading="getIsSubmittingUniformFee">Submit</FilledButton>
                </div>
            </form>
        </section>
    </div>
</template>