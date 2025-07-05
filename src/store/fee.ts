import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getFormData } from "../utils/getFormData";
import { useAlertStore } from "./Alert";
import { axiosInstance } from "../utils/api";
import { IFeeType, IPaymentDetail } from "./fee.interface";

const alertStore = useAlertStore();

export const useFeeStore = defineStore("fee", () => {
  const studentList = ref([]);
  const searching = ref(false);

  const getStudentList = computed(() => studentList.value);
  const getIsSearching = computed(() => searching.value);

  async function fetchReport(event: SubmitEvent) {
    const data = getFormData(event);

    try {
      searching.value = true;
      const response = await axiosInstance.post("/payments/report/", data);
      studentList.value = response.data?.success;
    } catch (error: any) {
      studentList.value = [];
      alertStore.showAppAlert(error, "error");
    } finally {
      searching.value = false;
    }
  }

  const isSubmittingFee = ref(false);
  const getIsSubmittingFee = computed(() => isSubmittingFee.value);

  async function submitFee(
    event: Event,
    fee_ids: number[],
    fee_list: {
      [id: number]: { id: number; amount_paid: number; balance_fee: number };
    },
    months: string[]
  ) {
    const data = getFormData(event);
    const fee_data = fee_ids.map((id) => {
      return {
        fee_type_id: fee_list[id].id,
        amount_paid: fee_list[id].amount_paid,
        balance_fee: fee_list[id].balance_fee,
      };
    });
    data.append("fee_data", JSON.stringify(fee_data));
    data.append("months", JSON.stringify(months));

    try {
      isSubmittingFee.value = true;
      const response = await axiosInstance.post("/payments/pay/", data);
      alertStore.showAppAlert(response.data?.success);
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isSubmittingFee.value = false;
    }
  }

  const enrollment = ref("");

  const isSearchingFeeDetail = ref(false);
  const getIsSearchingFeeDetail = computed(() => isSearchingFeeDetail.value);

  const feeDetails = ref<IPaymentDetail | null>(null);
  const getFeeDetails = computed(() => feeDetails.value);

  async function searchFeeDetails(event: Event) {
    const data = getFormData(event);

    try {
      isSearchingFeeDetail.value = true;
      const [r1, r2] = await Promise.all([
        axiosInstance.post("/payments/details/", data),
        fetchFeeTypes(),
      ]);
      feeDetails.value = r1.data?.success;
    } catch (error: any) {
      feeDetails.value = null;
      alertStore.showAppAlert(error, "error");
    } finally {
      isSearchingFeeDetail.value = false;
    }
  }

  const loadingFeeTypes = ref(false);
  const getLoadingFeeTypes = computed(() => loadingFeeTypes.value);

  const fee_types = ref<IFeeType[]>([]);
  const getFeeTypes = computed(() => fee_types.value);

  async function fetchFeeTypes() {
    if (fee_types.value.length) return;

    try {
      loadingFeeTypes.value = true;
      const response = await axiosInstance.get("/payments/feeTypes/");
      fee_types.value = response.data.success;
    } catch (error: any) {
      fee_types.value = [];
      alertStore.showAppAlert(error, "error");
    } finally {
      loadingFeeTypes.value = false;
    }
  }

  const payingBalance = ref(false);
  const getIsPayingBalance = computed(() => payingBalance.value);

  async function payBalance(event: Event) {
    const formData = getFormData(event);

    try {
      payingBalance.value = true;
      const response = await axiosInstance.post(
        "/payments/payBalance/",
        formData
      );
      alertStore.showAppAlert("Balance paid successfully!!");
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      payingBalance.value = false;
    }
  }

  return {
    enrollment,
    getStudentList,
    getIsSearching,
    getIsSubmittingFee,
    getFeeDetails,
    getIsSearchingFeeDetail,
    getLoadingFeeTypes,
    getFeeTypes,
    getIsPayingBalance,
    fetchReport,
    submitFee,
    searchFeeDetails,
    fetchFeeTypes,
    payBalance,
  };
});
