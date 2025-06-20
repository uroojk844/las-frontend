<script setup>
import { computed, reactive, ref, watch } from "vue"
import MainHeader from "@/components/MainHeader.vue"
import InputField from "@/components/InputField.vue"
import FilledButton from "@/components/FilledButton.vue"
import TextField from "@/components/TextField.vue";
import RadioGroup from "@/components/RadioGroup.vue";
import TableAdaptor from "@/components/TableAdaptor.vue";

import { today } from "@/utils/date";
import { useBookStore } from "@/store/book";
import useUserStore from "@/store/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { getUser } = storeToRefs(userStore);

const bookStore = useBookStore();
const { getIsLoadingClassBooks, getIsSubmittingBookFee, getClassBooks } = storeToRefs(bookStore);

const feeDetails = reactive({
    payment_mode: 'cash',
    amount_paid: 0,
    balance_fee: 0,
})

const book_list = computed(() => {
    return getClassBooks.value?.book_list ? JSON.parse(getClassBooks.value.book_list) : []
});

const discount = ref(0)
const totalAmount = computed(() => {
    if (book_list.value?.length) {
        return book_list.value.reduce((acc, cur) => +cur.price + acc, 0)
    } else return 0;
}
);
const discountAmount = computed(() => Math.round(+feeDetails.amount_paid * (+discount.value / 100)));

watch([getClassBooks, book_list], () => {
    feeDetails.amount_paid = totalAmount.value || 0;
})

function updateBalace(event) {
    switch (event.target.name) {
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

function submitBookFee(event) {
    let fee_data = {
        fee_type_id: 9,
        amount_paid: feeDetails.amount_paid,
        balance_fee: feeDetails.balance_fee,
    };
    bookStore.submitBookFee(event, fee_data);
}
</script>

<template>
    <MainHeader title="Buy books">
        <InputField type="date" v-model="today" />
    </MainHeader>

    <section class="bg-white p-4 rounded-md grid gap-4 mb-4">
        <form @submit.prevent="bookStore.fetchClassBooks" class="flex items-end gap-4">
            <InputField label="Enrollment number" name="enrollment" placeholder="Enter 8 digit enrollment" />
            <FilledButton :isLoading="getIsLoadingClassBooks">Search student</FilledButton>
        </form>
    </section>

    <div v-if="getClassBooks" class="contents">
        <section class="bg-white p-4 rounded-md grid-responsive">
            <InputField label="Class" v-model="getClassBooks.class_name" disabled :required="false" />
            <TableAdaptor title="Book list" class="col-span-full" :headers="['Book name', 'Price', 'Action']"
                :data="book_list" :loading="getIsLoadingClassBooks">
                <template #default="{ data }">
                    <tr v-for="(book, index) in data" :key="index" class="hover:bg-background cursor-pointer">
                        <td>{{ book.name }}</td>
                        <td>{{ book.price }}</td>
                        <td>
                            <FilledButton type="danger" class="h-10" @click.prevent="bookStore.removeBook(index)">
                                <icon icon="ph:trash-bold" />
                            </FilledButton>
                        </td>
                    </tr>
                </template>
            </TableAdaptor>
        </section>
        <MainHeader title="Enter fee details" class="mt-4" />
        <section class="bg-white p-4 rounded-md grid gap-4">
            <form @submit.prevent="submitBookFee" class="grid-responsive">
                <input type="hidden" name="collected_by" :value="getUser.id" required />
                <input type="hidden" name="student_id" :value="getClassBooks.student_id" required />

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

                <hr class="col-span-full border-dashed h-1 border-gray-200" />

                <div class="col-span-full">
                    <FilledButton :isLoading="getIsSubmittingBookFee">Submit</FilledButton>
                </div>
            </form>
        </section>
    </div>
</template>