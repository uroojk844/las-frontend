import { defineStore } from "pinia";
import { useAlertStore } from "@/store/Alert";
import { getFormData } from "@/utils/getFormData";
import { axiosInstance } from "@/utils/api";
import {
  IPreviousSchoolTemplate,
  IStudentStore,
} from "./students.interface";

const alertStore = useAlertStore();

const previousSchoolTemplate: IPreviousSchoolTemplate = {
  class: "",
  school: "",
  passingYear: "",
  percentage: "",
};

export const useStudentsStore = defineStore("studentsStore", {
  state: (): IStudentStore => ({
    isLoadingClassList: false,
    classList: [],
    studentEnrollment: null,
    studentFeeDetails: [],
    studentDetail: null,
    isLoadingStudent: false,
    students: [],
    isLoadingStudents: false,
    previousSchool: [{ ...previousSchoolTemplate }],
    isUpdatingDetails: false,
    isSearching: false,
  }),
  getters: {
    getIsLoadingClassList: (state) => state.isLoadingClassList,
    getClassList: (state) => state.classList,
    classListOption: (state) =>
      state.classList.map((cl) => {
        return { label: cl.name, value: cl.id };
      }),
    getStudentEnrolloment: (state) => state.studentEnrollment,
    getStudentFeeDetail: (state) => state.studentFeeDetails,
    getStudentDetail: (state) => state.studentDetail,
    getStudents: (state) => state.students,
    getIsLoadingStudent: (state) => state.isLoadingStudent,
    getIsLoadingStudents: (state) => state.isLoadingStudents,
    getPreviousSchool: (state) => state.previousSchool,
    getIsUpdatingDetails: (state) => state.isUpdatingDetails,
    getIsSearching: (state) => state.isSearching,
  },
  actions: {
    async fetchClassList() {
      try {
        this.isLoadingClassList = true;
        const { data } = await axiosInstance.get("/student/classList/");
        this.classList = data?.success;
      } catch (error: any) {
        alertStore.showAppAlert(error, "error");
      } finally {
        this.isLoadingClassList = false;
      }
    },
    async fetchStudents() {
      this.isLoadingStudents = true;
      try {
        const response = await axiosInstance.get("/student/all/");
        if (response.data?.success) {
          this.students = response.data.success;
        } else {
          alertStore.showAppAlert(response.data.error, "error");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        this.students = [];
      } finally {
        this.isLoadingStudents = false;
      }
    },
    async fetchStudentById(id: string) {
      this.isLoadingStudent = true;

      try {
        const [response, r2] = await Promise.all([
          axiosInstance.get("/student/byId/?id=" + id),
          this.fetchClassList(),
        ]);
        if (response.data?.success) {
          this.studentDetail = response.data.success;
          const previousSchool = JSON.parse(
            response.data.success.previousSchool
          );
          this.setPreviousSchool(previousSchool);
        } else {
          this.studentDetail = null;
          alertStore.showAppAlert(response.data.error, "error");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        this.studentDetail = null;
      } finally {
        this.isLoadingStudent = false;
      }
    },
    setPreviousSchool(data: IPreviousSchoolTemplate[]) {
      this.previousSchool = [];
      this.previousSchool = data;
    },
    resetPreviousSchool() {
      this.previousSchool = [{ ...previousSchoolTemplate }];
    },
    addMoreSchool() {
      this.previousSchool.push({ ...previousSchoolTemplate });
    },
    deleteSchool(index: number) {
      this.previousSchool.splice(index, 1);
    },
    async updateDetails(event: Event, fee_type_id: number[]) {
      const formData = getFormData(event);
      const previousSchoolData = JSON.stringify(this.previousSchool);
      formData.append("previousSchool", previousSchoolData);
      formData.append("fee_type_id", JSON.stringify(fee_type_id));
      try {
        this.isUpdatingDetails = true;
        const { data } = await axiosInstance.post("/student/update/", formData);
        if (data?.success) {
          alertStore.showAppAlert(data.success);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isUpdatingDetails = false;
      }
    },
    async addStudent(event: Event, fee_type_id: number[]) {
      const formData = getFormData(event);
      const previousSchoolData = JSON.stringify(this.previousSchool);
      formData.append("previousSchool", previousSchoolData);
      formData.append("fee_type_id", JSON.stringify(fee_type_id));

      const { data } = await axiosInstance.post("/student/add/", formData);
      if (data.success) {
        alertStore.showAppAlert(data.success);
        this.setEnrollment(data.enrollment);
      } else {
        alertStore.showAppAlert(data.error, "error");
      }
    },
    async searchStudent(event: Event) {
      const formData = getFormData(event);
      const { enrollment } = Object.fromEntries(formData.entries());
      try {
        this.isSearching = true;
        let { data } = await axiosInstance.get(
          `/payments/byId/?enrollment=${enrollment}`
        );
        if (data?.success) {
          this.studentFeeDetails = data.success;
        } else {
          this.studentFeeDetails = [];
        }
      } catch (error) {
      } finally {
        this.isSearching = false;
      }
    },
    setEnrollment(enrollment: number) {
      this.studentEnrollment = enrollment;
    },
    async copyEnrollment() {
      navigator.clipboard
        .writeText(this.studentEnrollment?.toString() as string)
        .then(() => {
          alertStore.showAppAlert("Enrollment number copied");
        });
    },
  },
});
