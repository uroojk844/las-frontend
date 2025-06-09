import { defineStore } from "pinia";
import { useAlertStore } from "@/store/Alert";

const alertStore = useAlertStore()

const previousSchoolTemplate = {
    "class": '',
    "school": '',
    "passingYear": '',
    "percentage": '',
};

export const useStudentsStore = defineStore("studentsStore", {
    state: () => ({
        students: [],
        isLoadingStudents: false,
        previousSchool: [{ ...previousSchoolTemplate }],
        isUpdatingDetails: false,
    }),
    getters: {
        getStudents: (state) => state.students,
        getIsLoadingUsers: (state) => state.isLoading,
        getPreviousSchool: (state) => state.previousSchool,
        getIsUpdatingDetails: (state) => state.isUpdatingDetails,
    },
    actions: {
        async fetchStudents() {
            this.isLoadingStudents = true;
            const response = await fetch('https://lasms.proficiosoftware.com/student/all/');
            try {
                const res = await response.json();
                if (res?.success) {
                    this.students = res.success;
                } else {
                    console.log(res.error);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                this.students = [];
            } finally {
                this.isLoadingStudents = false;
            }
        },
        setPreviousSchool(data) {
            this.previousSchool = data;
        },
        addMoreSchool() {
            this.previousSchool.push({ ...previousSchoolTemplate });
        },
        deleteSchool(index) {
            this.previousSchool.splice(index, 1);
        },
        async updateDetails(event, id) {
            const formData = new FormData(event.target);
            formData.append('id', id);
            const previousSchoolData = JSON.stringify(this.previousSchool);
            formData.append('previousSchool', previousSchoolData);
            try {
                this.isUpdatingDetails = true;
                const res = await fetch("https://lasms.proficiosoftware.com/student/update/", {
                    method: "post",
                    body: formData,
                });
                const data = await res.json();
                if (data?.success) {
                    alertStore.showAppAlert(data.success);
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isUpdatingDetails = false;
            }
        },
        async addStudent(event) {
            const formData = new FormData(event.target);
            const previousSchoolData = JSON.stringify(this.previousSchool);
            formData.append('previousSchool', previousSchoolData);

            const res = await fetch("https://lasms.proficiosoftware.com/student/add/", {
                method: "post",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                alertStore.showAppAlert(data.success);
            } else {
                alertStore.showAppAlert(data.error, 'error');
            }
        }
    }
})