<script setup>
import FilledButton from '@/components/FilledButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import Model from '@/components/Model.vue';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import TableAdaptor from '@/components/TableAdaptor.vue';
import { useBookStore } from '@/store/book';

const bookStore = useBookStore();
const { getIsLoadingBooks, getBooks } = storeToRefs(bookStore);

onMounted(() => {
    bookStore.fetchBooks();
})

const isFormOpen = ref(false);
</script>

<template>
    <MainHeader title="All Books">
        <FilledButton @click="isFormOpen = true">
            <icon icon="ph:plus-bold" /> Add Book
        </FilledButton>
    </MainHeader>

    <section class="grid bg-white p-4 rounded-md">
        <TableAdaptor title="Books information" :headers="['Name', 'Class', 'Selling Price', 'Buying Price', 'Actions']"
            :data="getBooks" filterBy="class_name" :loading="getIsLoadingBooks">
            <template #default="{ data }">
                <tr v-for="(book, index) in data" :key="index" class="hover:bg-background cursor-pointer">
                    <td>{{ book.name }}</td>
                    <td>{{ book.class_name }}</td>
                    <td>{{ book.selling_price }}</td>
                    <td>{{ book.buying_price }}</td>
                    <td class="max-w-32">
                        <div class="flex gap-4 items-center justify-evenly">
                            <FilledButton type="primary" size="sm">
                                <icon icon="ph:pen-bold" /> Update
                            </FilledButton>
                            <FilledButton type="danger" size="sm">
                                <icon icon="ph:trash-bold" /> Edit
                            </FilledButton>
                        </div>
                    </td>
                </tr>
            </template>
        </TableAdaptor>
    </section>

    <Model v-model="isFormOpen">
        <MainHeader title="Edit book details"/>

        <form action="">
            <InputField />
        </form>
    </Model>
</template>

<style scoped>
@reference "@/style.css";

td {
    @apply p-2;
}
</style>