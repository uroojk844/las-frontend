import { defineStore } from "pinia";
import { useAlertStore } from "./Alert";
import { computed, ref } from "vue";
import { getFormData } from "@/utils/getFormData";
import { axiosInstance } from "@/utils/api";
import { IBook, IClassBook, IFeeData } from "./book.interface";

const alertStore = useAlertStore();

export const useBookStore = defineStore("book", () => {
  const isLoadingBooks = ref<boolean>(false);
  const getIsLoadingBooks = computed<boolean>(() => isLoadingBooks.value);

  const books = ref<IBook[]>([]);
  const getBooks = computed<IBook[]>(() => books.value);

  async function fetchBooks() {
    if (books.value.length) return;

    try {
      isLoadingBooks.value = true;
      const { data } = await axiosInstance.get("/book/all/");
      books.value = data.success;
    } catch (error: any) {
      books.value = [];
      alertStore.showAppAlert(error, "error");
    } finally {
      isLoadingBooks.value = false;
    }
  }

  const isLoadingClassBooks = ref<boolean>(false);
  const getIsLoadingClassBooks = computed<boolean>(
    () => isLoadingClassBooks.value
  );

  const classBooks = ref<IClassBook | null>(null);
  const getClassBooks = computed<IClassBook | null>(() => classBooks.value);

  async function fetchClassBooks(event: Event): Promise<void> {
    const formData = getFormData(event);
    try {
      isLoadingClassBooks.value = true;
      const response = await axiosInstance.post("/book/buy/", formData);
      classBooks.value = response.data.success;
    } catch (error: any) {
      classBooks.value = null;
      alertStore.showAppAlert(error, "error");
    } finally {
      isLoadingClassBooks.value = false;
    }
  }

  function removeBook(index: number) {
    if (classBooks.value?.book_list) {
      let cb: IBook[] = JSON.parse(classBooks.value.book_list as string);
      cb.splice(index, 1);
      classBooks.value.book_list = JSON.stringify(cb);
    }
  }

  const isSubmittingBookFee = ref(false);
  const getIsSubmittingBookFee = computed(() => isSubmittingBookFee.value);

  async function submitBookFee(event: Event, fee_data: IFeeData) {
    const formData = getFormData(event);
    formData.append("fee_data", JSON.stringify([fee_data]));

    try {
      isSubmittingBookFee.value = true;
      const { data } = await axiosInstance.post("/payments/pay/", formData);
      alertStore.showAppAlert(data?.success);
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isSubmittingBookFee.value = false;
    }
  }

  const isAddingBook = ref<boolean>(false);
  const getIsAddingBook = computed(() => isAddingBook.value);

  async function addBook(event: Event) {
    const formData = getFormData(event);

    try {
      isAddingBook.value = true;
      const { data } = await axiosInstance.post("/book/add/", formData);
      alertStore.showAppAlert(data?.success);
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isAddingBook.value = false;
    }
  }

  const isUpdatingBook = ref<boolean>(false);
  const getIsUpdatingBook = computed(() => isUpdatingBook.value);

  async function updateBook(event: Event) {
    const formData = getFormData(event);

    try {
      isUpdatingBook.value = true;
      const { data } = await axiosInstance.post("/book/update/", formData);
      alertStore.showAppAlert(data?.success);
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isUpdatingBook.value = false;
    }
  }

  const isDeletingBook = ref<boolean>(false);
  const getIsDeletingBook = computed(() => isDeletingBook.value);

  async function deleteBook(id: number) {
    const formData = new FormData();
    formData.append("id", id.toString());

    try {
      isDeletingBook.value = true;
      const { data } = await axiosInstance.post("/book/delete/", formData);
      alertStore.showAppAlert(data?.success);
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isDeletingBook.value = false;
    }
  }

  return {
    getIsLoadingBooks,
    getBooks,
    getIsLoadingClassBooks,
    getClassBooks,
    getIsSubmittingBookFee,
    getIsAddingBook,
    getIsUpdatingBook,
    getIsDeletingBook,
    fetchBooks,
    fetchClassBooks,
    removeBook,
    submitBookFee,
    addBook,
    updateBook,
    deleteBook,
  };
});
