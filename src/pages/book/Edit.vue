<script setup lang="ts">
import FilledButton from '@/components/FilledButton.vue';
import Model from '@/components/Model.vue';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import TableAdaptor from '@/components/TableAdaptor.vue';
import { useBookStore } from '@/store/book';
import InputField from '@/components/InputField.vue';
import MainHeader from '@/components/MainHeader.vue';
import SelectField from '@/components/SelectField.vue';
import { useStudentsStore } from '@/store/students';
import { IBook } from '@/store/book.interface';

const bookStore = useBookStore();
const { getIsLoadingBooks, getBooks, getIsUpdatingBook, getIsDeletingBook, getIsAddingBook } = storeToRefs(bookStore);

const studentsStore = useStudentsStore();
const { classListOption } = storeToRefs(studentsStore);

const defaultValue: IBook = {
    id: 0,
    name: '',
    class_name: '',
    class_id: 0,
    buying_price: 0,
    selling_price: 0,
};

const selectedBook = ref<IBook>({ ...defaultValue });

const isEditing = ref(false);
const isFormOpen = ref<boolean>(false);

function addBook() {
    isEditing.value = false;
    isFormOpen.value = true;
    selectedBook.value = { ...defaultValue };
}

function setBookDetails(id: number) {
    isEditing.value = true;
    isFormOpen.value = true;
    let book = getBooks.value.find((book) => book.id == id);
    if (!!book) {
        selectedBook.value = book;
    }
}

function handleModelSubmit(event: Event) {
    if (isEditing.value) {
        bookStore.updateBook(event);
    } else {
        bookStore.addBook(event);
        bookStore.fetchBooks();
    }
    isFormOpen.value = false;
}

onMounted(() => {
    bookStore.fetchBooks();
    studentsStore.fetchClassList();
})
</script>

<template>
    <MainHeader title="All Books">
        <FilledButton @click="addBook">
            <icon icon="ph:plus-bold" /> Add Book
        </FilledButton>
    </MainHeader>

    <section class="grid bg-surface p-4 rounded-md">
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
                            <FilledButton @click="setBookDetails(book.id as number)" type="primary" size="sm"
                                :isLoading="getIsUpdatingBook">
                                <icon icon="ph:pen-bold" /> Update
                            </FilledButton>

                            <FilledButton @click="bookStore.deleteBook(book.id as number)" type="danger" size="sm"
                                :isLoading="getIsDeletingBook">
                                <icon icon="ph:trash-bold" /> Delete
                            </FilledButton>
                        </div>
                    </td>
                </tr>
            </template>
        </TableAdaptor>
    </section>

    <Model v-model="isFormOpen">
        <MainHeader :title="isEditing ? 'Edit book details' : 'Add book'" />
        <form @submit.prevent="handleModelSubmit" class="grid sm:grid-cols-2 gap-4">
            <input type="hidden" v-model="selectedBook.id" name="id" :required="isEditing">
            <InputField label="Book name" name="name" v-model="selectedBook.name" />
            <SelectField label="Class" name="class_id" v-model="selectedBook.class_id" :options="classListOption" />
            <InputField label="Buying price" name="buying_price" type="number" :min="1"
                v-model="selectedBook.buying_price" />
            <InputField label="Selling price" name="selling_price" type="number" :min="1"
                v-model="selectedBook.selling_price" />
            <div>
                <FilledButton :isLoading="getIsUpdatingBook || getIsAddingBook">{{ isEditing ? 'Update' : 'Add' }}
                </FilledButton>
            </div>
        </form>
    </Model>
</template>

<style scoped>
@reference "@/style.css";

td {
    @apply p-2;
}
</style>