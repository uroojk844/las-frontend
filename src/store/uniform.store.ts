import { defineStore } from "pinia";
import { IBuyDetail, ISize, IUniform } from "./uniform.interface";
import { computed, ref } from "vue";
import { axiosInstance } from "@/utils/api";
import { useAlertStore } from "./Alert";
import { getFormData } from "@/utils/getFormData";
import { IFeeData } from "./book.interface";

const alertStore = useAlertStore();

export const useUniformStore = defineStore("uniform", () => {
  const isLoadingUniform = ref<boolean>(false);
  const getIsLoadingUniform = computed(() => isLoadingUniform.value);

  const uniforms = ref<IUniform[]>([]);
  const getUniforms = computed(() => uniforms.value);

  async function fetchUniformList(force: boolean = true) {
    if (force == false) return;

    try {
      isLoadingUniform.value = true;
      const [r1, _] = await Promise.all([
        axiosInstance.get("/uniform/list/"),
        fetchSize(),
      ]);
      uniforms.value = r1.data.success;
    } catch (error: any) {
      uniforms.value = [];
      alertStore.showAppAlert(error, "error");
    } finally {
      isLoadingUniform.value = false;
    }
  }

  const isLoadingDetails = ref<boolean>(false);
  const getIsLoadingDetails = computed(() => isLoadingDetails.value);

  const studentDetail = ref<IBuyDetail | null>(null);
  const getBuyDetail = computed(() => studentDetail.value);

  async function fetchBuyDetails(event: Event) {
    const formData = getFormData(event);

    try {
      isLoadingDetails.value = true;
      const [r1, _] = await Promise.all([
        axiosInstance.post("/uniform/buy/", formData),
        fetchUniformList(),
      ]);
      studentDetail.value = r1.data.success;
    } catch (error: any) {
      studentDetail.value = null;
      alertStore.showAppAlert(error, "error");
    } finally {
      isLoadingDetails.value = false;
    }
  }

  const uniformSize = ref<ISize[]>([]);
  const getSizeOptions = computed(() =>
    uniformSize.value.map((s) => {
      return {
        label: s.size,
        value: s.id,
      };
    })
  );

  async function fetchSize() {
    if (uniformSize.value.length) return;

    try {
      const { data } = await axiosInstance.post("/uniform/size/");
      uniformSize.value = data.success;
    } catch (error: any) {
      uniformSize.value = [];
      alertStore.showAppAlert(error, "error");
    }
  }

  const isAddingUniform = ref<boolean>(false);
  const getIsAddingUniform = computed(() => isAddingUniform.value);

  async function addUniform(event: Event) {
    const formData = getFormData(event);

    try {
      isAddingUniform.value = true;
      const { data } = await axiosInstance.post("/uniform/add/", formData);
      alertStore.showAppAlert(data?.success);
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isAddingUniform.value = false;
    }
  }

  const isUpdatingUniform = ref<boolean>(false);
  const getIsUpdatingUniform = computed(() => isUpdatingUniform.value);

  async function updateUniform(event: Event) {
    const formData = getFormData(event);

    try {
      isUpdatingUniform.value = true;
      const { data } = await axiosInstance.post("/uniform/update/", formData);
      alertStore.showAppAlert(data?.success);
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isUpdatingUniform.value = false;
    }
  }

  const isDeletingUniform = ref<boolean>(false);
  const getIsDeletingUniform = computed(() => isDeletingUniform.value);

  async function deleteUniform(id: number) {
    const formData = new FormData();
    formData.append("id", id.toString());

    try {
      isDeletingUniform.value = true;
      const { data } = await axiosInstance.post("/uniform/delete/", formData);
      alertStore.showAppAlert(data?.success);
      uniforms.value = uniforms.value.filter((u) => u.id != id);
    } catch (error: any) {
      alertStore.showAppAlert(error, "error");
    } finally {
      isDeletingUniform.value = false;
    }
  }

  /**
   * @param id
   * Remove uniform locally from getUniform
   */
  async function removeUniform(id: number) {
    uniforms.value = uniforms.value.filter((u) => u.id != id);
  }

   const isSubmittingUniformFee = ref(false);
   const getIsSubmittingUniformFee = computed(() => isSubmittingUniformFee.value);
 
   async function submitUniformFee(event: Event, fee_data: IFeeData) {
     const formData = getFormData(event);
     formData.append("fee_data", JSON.stringify([fee_data]));
 
     try {
       isSubmittingUniformFee.value = true;
       const { data } = await axiosInstance.post("/payments/pay/", formData);
       alertStore.showAppAlert(data?.success);
       (event.target as HTMLFormElement).reset();
     } catch (error: any) {
       alertStore.showAppAlert(error, "error");
     } finally {
       isSubmittingUniformFee.value = false;
     }
   }

  return {
    getIsLoadingUniform,
    getUniforms,
    getIsLoadingDetails,
    getBuyDetail,
    getSizeOptions,
    getIsAddingUniform,
    getIsUpdatingUniform,
    getIsDeletingUniform,
    getIsSubmittingUniformFee,
    fetchUniformList,
    fetchBuyDetails,
    fetchSize,
    addUniform,
    updateUniform,
    deleteUniform,
    removeUniform,
    submitUniformFee,
  };
});
