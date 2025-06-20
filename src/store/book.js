import { defineStore } from "pinia";
import { useAlertStore } from "./Alert";
import { computed, ref } from "vue";
import { getFormData } from "@/utils/getFormData";
import { axiosInstance } from "@/utils/api";

const alertStore = useAlertStore();

export const useBookStore = defineStore("book", () => {
    const isLoadingBooks = ref(false);
    const getIsLoadingBooks = computed(() => isLoadingBooks.value)

    const books = ref([]);
    const getBooks = computed(() => books.value);

    async function fetchBooks() {
        if (books.value.length) return;

        try {
            isLoadingBooks.value = true;
            const response = await axiosInstance.get("/book/all/");
            books.value = response.data.success;
        } catch (error) {
            books.value = [];
            alertStore.showAppAlert(error, 'error');
        } finally {
            isLoadingBooks.value = false;
        }
    }

    const isLoadingClassBooks = ref(false);
    const getIsLoadingClassBooks = computed(() => isLoadingClassBooks.value)

    const classBooks = ref({});
    const getClassBooks = computed(() => classBooks.value);

    async function fetchClassBooks(event) {
        const formData = getFormData(event);

        try {
            isLoadingClassBooks.value = true;
            const response = await axiosInstance.post("/book/buy/", formData);
            classBooks.value = response.data.success;
        } catch (error) {
            classBooks.value = null;
            alertStore.showAppAlert(error, 'error');
        } finally {
            isLoadingClassBooks.value = false;
        }
    }

    function removeBook(index) {
        let cb = JSON.parse(classBooks.value.book_list);
        cb.splice(index, 1);
        classBooks.value.book_list = JSON.stringify(cb);
    }

    const isSubmittingBookFee = ref(false);
    const getIsSubmittingBookFee = computed(() => isSubmittingBookFee.value);

    async function submitBookFee(event, fee_data) {
        const formData = getFormData(event);
        formData.append('fee_data', JSON.stringify([fee_data]));

        try {
            isSubmittingBookFee.value = true;
            const { data } = await axiosInstance.post("/payments/pay/", formData);
            alertStore.showAppAlert(data?.success);
            event.target.reset();
        } catch (error) {
            alertStore.showAppAlert(error, "error");
        } finally {
            isSubmittingBookFee.value = false;
        }
    }

    return {
        getIsLoadingBooks,
        getBooks,
        getIsLoadingClassBooks,
        getClassBooks,
        getIsSubmittingBookFee,
        fetchBooks,
        fetchClassBooks,
        removeBook,
        submitBookFee,
    }
});