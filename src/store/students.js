import { defineStore } from "pinia";
import { useAlertStore } from "@/store/Alert";
import { getFormData } from "@/utils/getFormData";
import { axiosInstance } from "@/utils/api";

const alertStore = useAlertStore();

const previousSchoolTemplate = {
    "class": '',
    "school": '',
    "passingYear": '',
    "percentage": '',
};

export const useStudentsStore = defineStore("studentsStore", {
    state: () => ({
        isLoadingClassList: false,
        classList: [],
        studentEnrollment: null,
        student: [],
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
        classListOption: (state) => state.classList.map((cl) => {
            return { label: cl.name, value: cl.id }
        }),
        getStudentEnrolloment: (state) => state.studentEnrollment,
        getStudent: (state) => state.student,
        getStudents: (state) => state.students,
        getIsLoadingStudent: (state) => state.isLoading,
        getIsLoadingUsers: (state) => state.isLoading,
        getPreviousSchool: (state) => state.previousSchool,
        getIsUpdatingDetails: (state) => state.isUpdatingDetails,
        getIsSearching: (state) => state.isSearching,
    },
    actions: {
        async fetchClassList() {
            try {
                this.isLoadingClassList = true;
                const { data } = await axiosInstance.get('/student/classList/');
                this.classList = data?.success;
            } catch (error) {
                alertStore.showAppAlert(error, 'error');
            } finally {
                this.isLoadingClassList = false;
            }
        },
        async fetchStudents() {
            this.isLoadingStudents = true;
            try {
                const response = await axiosInstance.get('/student/all/');
                if (response.data?.success) {
                    this.students = response.data.success;
                } else {
                    alertStore.showAppAlert(response.data.error, 'error');
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                this.students = [];
            } finally {
                this.isLoadingStudents = false;
            }
        },
        async fetchStudentById(id) {
            this.isLoadingStudent = true;

            try {
                const [response, r2] = await Promise.all([
                    axiosInstance.get('/student/byId/?id=' + id),
                    this.fetchClassList(),
                ]);
                if (response.data?.success) {
                    this.student = response.data.success;
                    const previousSchool = JSON.parse(response.data.success.previousSchool);
                    this.setPreviousSchool(previousSchool);
                } else {
                    alertStore.showAppAlert(response.data.error, 'error');
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                this.student = null;
            } finally {
                this.isLoadingStudent = false;
            }
        },
        setPreviousSchool(data) {
            this.previousSchool = [];
            this.previousSchool = data;
        },
        resetPreviousSchool() {
            this.previousSchool = [{ ...previousSchoolTemplate }];
        },
        addMoreSchool() {
            this.previousSchool.push({ ...previousSchoolTemplate });
        },
        deleteSchool(index) {
            this.previousSchool.splice(index, 1);
        },
        async updateDetails(event, fee_type_id) {
            const formData = getFormData(event);
            const previousSchoolData = JSON.stringify(this.previousSchool);
            formData.append('previousSchool', previousSchoolData);
            formData.append('fee_type_id', JSON.stringify(fee_type_id));
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
        async addStudent(event, fee_type_id) {
            const formData = getFormData(event);
            const previousSchoolData = JSON.stringify(this.previousSchool);
            formData.append('previousSchool', previousSchoolData);
            formData.append('fee_type_id', JSON.stringify(fee_type_id));

            const { data } = await axiosInstance.post("/student/add/", formData);
            if (data.success) {
                alertStore.showAppAlert(data.success);
                this.setEnrollment(data.enrollment);
            } else {
                alertStore.showAppAlert(res.data.error, 'error');
            }
        },
        async searchStudent(enrollment) {
            try {
                this.isSearching = true;
                let { data } = await axiosInstance.get("/payments/byId/?enrollment=" + enrollment);
                if (data?.success) {
                    this.student = data.success;
                } else {
                    this.student = [];
                }
            } catch (error) {

            } finally {
                this.isSearching = false;
            }
        },
        setEnrollment(enrollment) {
            this.studentEnrollment = enrollment;
        },
        async copyEnrollment() {
            navigator.clipboard.writeText(this.studentEnrollment).then(() => {
                alertStore.showAppAlert("Enrollment number copied");
            });
        }
    }
})