<script setup lang="ts">
import FilledButton from '@/components/FilledButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import TableAdaptor from '@/components/TableAdaptor.vue';
import { useBookStore } from '@/store/book';
import useUserStore from '@/store/user';

const userStore = useUserStore();
const bookStore = useBookStore();
const { getIsLoadingBooks, getBooks } = storeToRefs(bookStore);

onMounted(() => {
    bookStore.fetchBooks();
})

</script>

<template>
    <MainHeader title="All Books">
        <RouterLink v-if="userStore.getRole == 'super'" to="/books/edit">
            <FilledButton>
                <icon icon="ph:plus-bold" /> Add Book
            </FilledButton>
        </RouterLink>
    </MainHeader>

    <section class="grid bg-surface p-4 rounded-md">
        <TableAdaptor title="Books information" :headers="['Name', 'Class', 'Price']" :data="getBooks"
            filterBy="class_name" :loading="getIsLoadingBooks">
            <template #default="{ data }">
                <tr v-for="(book, index) in data" :key="index" class="hover:bg-background cursor-pointer"
                    @click="() => $router.push('/book/view/' + book.id)" title="Click to view details">
                    <td>{{ book.name }}</td>
                    <td>{{ book.class_name }}</td>
                    <td>{{ book.selling_price }}</td>
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
</style>